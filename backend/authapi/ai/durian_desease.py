"""
Durian Disease Detector (YOLOv8)
Classes: mold, rot
"""

import os
from pathlib import Path
from typing import Dict, Any, Optional

from ultralytics import YOLO

_disease_model = None

BASE_DIR = Path(__file__).parent.parent.parent
MODELS_DIR = BASE_DIR / "models"
DEFAULT_MODEL = MODELS_DIR / "durian_disease_v8_best.pt"


def load_disease_model(model_path: Optional[str] = None):
    global _disease_model

    if _disease_model is not None:
        return _disease_model

    if model_path is None:
        model_path = DEFAULT_MODEL

    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Disease model not found: {model_path}")

    model = YOLO(str(model_path))
    _disease_model = model
    return _disease_model


def get_durian_disease(image_path: str, model_path: Optional[str] = None) -> Dict[str, Any]:
    """
    Detect durian diseases using YOLOv8

    Returns:
        {
            success: bool,
            detections: [
                {
                    class_name,
                    confidence,
                    bbox
                }
            ]
        }
    """

    try:
        model = load_disease_model(model_path)

        results = model(image_path, verbose=False)

        detections = []

        for r in results:
            boxes = r.boxes
            names = r.names  # class id to name mapping

            if boxes is None:
                continue

            for box in boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                bbox = box.xyxy[0].tolist()  # [x1, y1, x2, y2]

                detections.append({
                    "class_id": class_id,
                    "class_name": names[class_id],
                    "confidence": round(confidence, 4),
                    "bbox": [float(x) for x in bbox]
                })

        return {
            "success": True,
            "total_detections": len(detections),
            "detections": detections
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(type(e).__name__),
            "message": str(e)
        }