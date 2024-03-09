from config import AppConfig
from ciaos import save


def saveFeedback(base64_data: str):
    try:
        imageKey = save(AppConfig.STORAGE_BASE_URL, None, base64_data)
        return imageKey
    except Exception as e:
        print(f"Error saving feedback: {e}")
        return None
