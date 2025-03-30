import unsloth
import torch
from trl import SFTConfig, SFTTrainer, DataCollatorForCompletionOnlyLM
from transformers import TrainingArguments, TextStreamer
from datasets import Dataset, load_dataset
from unsloth import FastLanguageModel, is_bfloat16_supported
import os

max_seq_length = 4096
dtype = None
load_in_4bit = True

print(f"Downloading model...", flush=True)

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = "unsloth/Meta-Llama-3.1-8B-bnb-4bit",
    max_seq_length = max_seq_length,
    dtype = dtype,
    load_in_4bit = load_in_4bit,
    cache_dir = "/mnt/runs/students/juan.dominguezr/models",
)


print(f"Model downloaded.", flush=True)

model = FastLanguageModel.get_peft_model(
    model,
    r = 16,
    target_modules = ["q_proj", "k_proj", "v_proj", "o_proj",
                      "gate_proj", "up_proj", "down_proj",],
    lora_alpha = 16,
    lora_dropout = 0,
    bias = "none",
    use_gradient_checkpointing = "unsloth",
    random_state = 3407,
    use_rslora = False,
    loftq_config = None,
)

print(f"Model configured.", flush=True)

print(f"Preprocessing data...", flush=True)

dataset = Dataset.from_json("/mnt/runs/students/juan.dominguezr/TFG/data/processed/msmarco-prompts.jsonl")

EOS_TOKEN = tokenizer.eos_token
RESPONSE_TOKEN = '{"M: : ...\n'

def formatting_prompts_func(examples):
    prompts = examples["prompt"]
    responses = ['{' + f'"M": {rel}, "T": {rel}, "O": {rel}' + '}' for rel in examples["relevance"]]
    texts = []

    for prompt, response in zip(prompts, responses):
        text = f"{prompt}{response}{EOS_TOKEN}"
        texts.append(text)

    return {"text": texts}

dataset = dataset.map(formatting_prompts_func, batched=True)
collator = DataCollatorForCompletionOnlyLM(RESPONSE_TOKEN, tokenizer=tokenizer)

print(f"Data preprocessed.", flush=True)

trainer = SFTTrainer(
    model = model,
    tokenizer = tokenizer,
    train_dataset = dataset,
    dataset_text_field = "text",
    max_seq_length = max_seq_length,
    dataset_num_proc = 2,
    packing = False,
    args = TrainingArguments(
        per_device_train_batch_size = 2,
        gradient_accumulation_steps = 4,
        warmup_steps = 5,
        num_train_epochs = 2,
        learning_rate = 1e-4,
        fp16 = not is_bfloat16_supported(),
        bf16 = is_bfloat16_supported(),
        logging_steps = 1,
        optim = "adamw_8bit",
        weight_decay = 0.01,
        lr_scheduler_type = "linear",
        seed = 3407,
        output_dir = "/mnt/runs/students/juan.dominguezr/outputs",
        report_to = "none",
        save_strategy = "steps",
        save_steps = 20000,
    ),
    data_collator=collator,
)

gpu_stats = torch.cuda.get_device_properties(0)
start_gpu_memory = round(torch.cuda.max_memory_reserved() / 1024 / 1024 / 1024, 3)
max_memory = round(gpu_stats.total_memory / 1024 / 1024 / 1024, 3)
print(f"GPU = {gpu_stats.name}. Max memory = {max_memory} GB.")
print(f"{start_gpu_memory} GB of memory reserved.")

print(f"Training...", flush=True)

trainer_stats = trainer.train()

print(f"Training finished.", flush=True)

used_memory = round(torch.cuda.max_memory_reserved() / 1024 / 1024 / 1024, 3)
used_memory_for_lora = round(used_memory - start_gpu_memory, 3)
used_percentage = round(used_memory         /max_memory*100, 3)
lora_percentage = round(used_memory_for_lora/max_memory*100, 3)
print(f"{trainer_stats.metrics['train_runtime']} seconds used for training.")
print(f"{round(trainer_stats.metrics['train_runtime']/60, 2)} minutes used for training.")
print(f"Peak reserved memory = {used_memory} GB.")
print(f"Peak reserved memory for training = {used_memory_for_lora} GB.")
print(f"Peak reserved memory % of max memory = {used_percentage} %.")
print(f"Peak reserved memory for training % of max memory = {lora_percentage} %.")

model.push_to_hub_gguf(
        "juandominguez/LlaRA",
        tokenizer,
        quantization_method = ["f16", "q4_k_m", "q8_0", "q5_k_m",],
        token = os.getenv("HUGGINGFACE_TOKEN"),
    )