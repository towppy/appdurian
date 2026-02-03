"""
Durian Detection Model Training Script (TensorFlow/Keras)
Downloads dataset from Roboflow and trains with TensorFlow

Usage:
    python durian_detection_tf.py

Requirements:
    pip install roboflow tensorflow opencv-python
"""

import os
import sys
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

def install_dependencies():
    """Install required packages if not available"""
    import subprocess
    packages = ["roboflow", "tensorflow", "opencv-python"]
    for package in packages:
        try:
            __import__(package.replace("-", "_"))
        except ImportError:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# Ensure dependencies are installed
install_dependencies()

import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2, ResNet50, EfficientNetB0
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, TensorBoard, ReduceLROnPlateau
from roboflow import Roboflow
from dotenv import load_dotenv
import numpy as np
import json

# Load environment variables
load_dotenv(Path(__file__).parent / ".env")

# ==================== CONFIGURATION ====================

# Roboflow Configuration
ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")
ROBOFLOW_WORKSPACE = os.getenv("ROBOFLOW_WORKSPACE", "towppys-nest")
ROBOFLOW_PROJECT = os.getenv("ROBOFLOW_PROJECT", "durian-detection-dnicw")
ROBOFLOW_VERSION = int(os.getenv("ROBOFLOW_VERSION", "7"))

# Training Configuration
MODEL_BACKBONE = "mobilenetv2"  # Options: mobilenetv2, resnet50, efficientnetb0
EPOCHS = 100
IMAGE_SIZE = 224  # MobileNetV2/ResNet default
BATCH_SIZE = 32
LEARNING_RATE = 0.001
PATIENCE = 15  # Early stopping patience

# Paths
BASE_DIR = Path(__file__).parent.parent
DATASET_DIR = BASE_DIR / "datasets" / "durian_detection_tf"
MODELS_DIR = BASE_DIR / "models"
LOGS_DIR = BASE_DIR / "training_scripts" / "logs"

# ===========================================================


def download_dataset():
    """Download dataset from Roboflow in TensorFlow format"""
    print("\n" + "="*50)
    print("📥 DOWNLOADING DATASET FROM ROBOFLOW")
    print("="*50)
    
    if not ROBOFLOW_API_KEY:
        print("❌ Error: ROBOFLOW_API_KEY not found")
        sys.exit(1)
    
    try:
        rf = Roboflow(api_key=ROBOFLOW_API_KEY)
        project = rf.workspace(ROBOFLOW_WORKSPACE).project(ROBOFLOW_PROJECT)
        
        print(f"📁 Workspace: {ROBOFLOW_WORKSPACE}")
        print(f"📂 Project: {ROBOFLOW_PROJECT}")
        print(f"📌 Version: {ROBOFLOW_VERSION}")
        
        # Download in TFRecord format for object detection
        dataset = project.version(ROBOFLOW_VERSION).download(
            "tfrecord",  # TensorFlow format for object detection
            location=str(DATASET_DIR)
        )
        
        print(f"✅ Dataset downloaded to: {DATASET_DIR}")
        return dataset
        
    except Exception as e:
        print(f"❌ Error downloading dataset: {e}")
        sys.exit(1)


def create_data_generators(dataset_path: Path):
    """Create TensorFlow data generators with augmentation"""
    print("\n" + "="*50)
    print("📊 CREATING DATA GENERATORS")
    print("="*50)
    
    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest',
        validation_split=0.2  # Use 20% for validation if no val folder
    )
    
    # Only rescaling for validation
    val_datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2
    )
    
    # Check for train/valid folders
    train_dir = dataset_path / "train"
    valid_dir = dataset_path / "valid"
    
    if not train_dir.exists():
        train_dir = dataset_path
    if not valid_dir.exists():
        valid_dir = None
    
    print(f"📁 Train directory: {train_dir}")
    
    # Create generators
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(IMAGE_SIZE, IMAGE_SIZE),
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='training' if valid_dir is None else None,
        shuffle=True
    )
    
    if valid_dir and valid_dir.exists():
        val_generator = val_datagen.flow_from_directory(
            valid_dir,
            target_size=(IMAGE_SIZE, IMAGE_SIZE),
            batch_size=BATCH_SIZE,
            class_mode='categorical',
            shuffle=False
        )
    else:
        val_generator = val_datagen.flow_from_directory(
            train_dir,
            target_size=(IMAGE_SIZE, IMAGE_SIZE),
            batch_size=BATCH_SIZE,
            class_mode='categorical',
            subset='validation',
            shuffle=False
        )
    
    print(f"✅ Found {train_generator.samples} training images")
    print(f"✅ Found {val_generator.samples} validation images")
    print(f"📋 Classes: {train_generator.class_indices}")
    
    return train_generator, val_generator


def build_model(num_classes: int):
    """Build transfer learning model with chosen backbone"""
    print("\n" + "="*50)
    print("🏗️ BUILDING MODEL")
    print("="*50)
    
    # Choose backbone
    if MODEL_BACKBONE == "mobilenetv2":
        base_model = MobileNetV2(
            weights='imagenet',
            include_top=False,
            input_shape=(IMAGE_SIZE, IMAGE_SIZE, 3)
        )
        print("🤖 Using MobileNetV2 backbone")
    elif MODEL_BACKBONE == "resnet50":
        base_model = ResNet50(
            weights='imagenet',
            include_top=False,
            input_shape=(IMAGE_SIZE, IMAGE_SIZE, 3)
        )
        print("🤖 Using ResNet50 backbone")
    elif MODEL_BACKBONE == "efficientnetb0":
        base_model = EfficientNetB0(
            weights='imagenet',
            include_top=False,
            input_shape=(IMAGE_SIZE, IMAGE_SIZE, 3)
        )
        print("🤖 Using EfficientNetB0 backbone")
    else:
        raise ValueError(f"Unknown backbone: {MODEL_BACKBONE}")
    
    # Freeze base model layers
    base_model.trainable = False
    
    # Build model
    model = keras.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.3),
        layers.Dense(num_classes, activation='softmax')
    ])
    
    # Compile model
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss='categorical_crossentropy',
        metrics=['accuracy', keras.metrics.Precision(), keras.metrics.Recall()]
    )
    
    model.summary()
    
    return model, base_model


def fine_tune_model(model, base_model):
    """Unfreeze some layers and fine-tune"""
    print("\n" + "="*50)
    print("🔧 FINE-TUNING MODEL")
    print("="*50)
    
    # Unfreeze the top layers of the base model
    base_model.trainable = True
    
    # Freeze all layers except the last 20
    for layer in base_model.layers[:-20]:
        layer.trainable = False
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=LEARNING_RATE / 10),
        loss='categorical_crossentropy',
        metrics=['accuracy', keras.metrics.Precision(), keras.metrics.Recall()]
    )
    
    print(f"✅ Unfroze last 20 layers for fine-tuning")
    return model


def train_model(model, train_gen, val_gen, phase="initial"):
    """Train the model"""
    print("\n" + "="*50)
    print(f"🚀 TRAINING MODEL ({phase.upper()} PHASE)")
    print("="*50)
    
    # Create directories
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    LOGS_DIR.mkdir(parents=True, exist_ok=True)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Callbacks
    callbacks = [
        ModelCheckpoint(
            str(MODELS_DIR / f"durian_detector_{phase}_{timestamp}.keras"),
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        EarlyStopping(
            monitor='val_loss',
            patience=PATIENCE,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.2,
            patience=5,
            min_lr=1e-7,
            verbose=1
        ),
        TensorBoard(
            log_dir=str(LOGS_DIR / f"{phase}_{timestamp}"),
            histogram_freq=1
        )
    ]
    
    epochs = EPOCHS if phase == "initial" else EPOCHS // 2
    
    print(f"📊 Epochs: {epochs}")
    print(f"📦 Batch Size: {BATCH_SIZE}")
    print(f"🖼️  Image Size: {IMAGE_SIZE}x{IMAGE_SIZE}")
    
    # Train
    history = model.fit(
        train_gen,
        epochs=epochs,
        validation_data=val_gen,
        callbacks=callbacks,
        verbose=1
    )
    
    return history, timestamp


def evaluate_model(model, val_gen, class_indices):
    """Evaluate the trained model"""
    print("\n" + "="*50)
    print("📊 EVALUATING MODEL")
    print("="*50)
    
    # Evaluate
    results = model.evaluate(val_gen, verbose=1)
    
    print(f"\n📈 Evaluation Results:")
    print(f"   Loss: {results[0]:.4f}")
    print(f"   Accuracy: {results[1]:.4f}")
    print(f"   Precision: {results[2]:.4f}")
    print(f"   Recall: {results[3]:.4f}")
    
    return results


def export_model(model, timestamp: str, class_indices: dict):
    """Export model in different formats"""
    print("\n" + "="*50)
    print("📦 EXPORTING MODEL")
    print("="*50)
    
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    
    # Save Keras model
    keras_path = MODELS_DIR / f"durian_detector_final_{timestamp}.keras"
    model.save(keras_path)
    print(f"✅ Keras model saved: {keras_path}")
    
    # Save as SavedModel format
    savedmodel_path = MODELS_DIR / f"durian_detector_{timestamp}_savedmodel"
    model.save(savedmodel_path)
    print(f"✅ SavedModel saved: {savedmodel_path}")
    
    # Convert to TFLite (for mobile deployment)
    try:
        converter = tf.lite.TFLiteConverter.from_keras_model(model)
        converter.optimizations = [tf.lite.Optimize.DEFAULT]
        tflite_model = converter.convert()
        
        tflite_path = MODELS_DIR / f"durian_detector_{timestamp}.tflite"
        with open(tflite_path, 'wb') as f:
            f.write(tflite_model)
        print(f"✅ TFLite model saved: {tflite_path}")
    except Exception as e:
        print(f"⚠️ TFLite export failed: {e}")
    
    # Save class labels
    labels_path = MODELS_DIR / f"durian_labels_{timestamp}.json"
    # Invert class indices
    labels = {v: k for k, v in class_indices.items()}
    with open(labels_path, 'w') as f:
        json.dump(labels, f, indent=2)
    print(f"✅ Labels saved: {labels_path}")
    
    return keras_path


def main():
    """Main training pipeline"""
    print("\n" + "="*60)
    print("🍈 DURIAN DETECTION - TENSORFLOW TRAINING PIPELINE 🍈")
    print("="*60)
    print(f"📅 Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🔧 TensorFlow version: {tf.__version__}")
    print(f"🖥️  GPU Available: {len(tf.config.list_physical_devices('GPU')) > 0}")
    
    # Step 1: Download dataset
    download_dataset()
    
    # Step 2: Create data generators
    train_gen, val_gen = create_data_generators(DATASET_DIR)
    num_classes = len(train_gen.class_indices)
    
    # Step 3: Build model
    model, base_model = build_model(num_classes)
    
    # Step 4: Initial training (frozen backbone)
    history1, timestamp = train_model(model, train_gen, val_gen, phase="initial")
    
    # Step 5: Fine-tune (unfreeze some layers)
    model = fine_tune_model(model, base_model)
    history2, _ = train_model(model, train_gen, val_gen, phase="finetune")
    
    # Step 6: Evaluate
    evaluate_model(model, val_gen, train_gen.class_indices)
    
    # Step 7: Export
    model_path = export_model(model, timestamp, train_gen.class_indices)
    
    print("\n" + "="*60)
    print("🎉 TRAINING COMPLETE!")
    print("="*60)
    print(f"📁 Dataset: {DATASET_DIR}")
    print(f"📁 Logs: {LOGS_DIR}")
    print(f"📁 Model: {model_path}")
    print(f"📅 Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("\n💡 View training with TensorBoard:")
    print(f"   tensorboard --logdir {LOGS_DIR}")


if __name__ == "__main__":
    main()
