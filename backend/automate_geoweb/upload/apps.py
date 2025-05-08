from django.apps import AppConfig
import asyncio
import logging

logger = logging.getLogger(__name__)


class UploadConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'upload'

    def ready(self):
        logger.info("UploadConfig.ready started")
        try:
            # Use get_event_loop to avoid creating a new loop if one exists
            loop = asyncio.get_event_loop()
            if loop.is_running():
                logger.warning("Event loop already running, creating new loop for preload")
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
            loop.run_until_complete(self.preload_model())
            logger.info("SentenceTransformer model preloaded successfully")
        except Exception as e:
            logger.error(f"Error preloading SentenceTransformer model: {e}", exc_info=True)
        finally:
            if not loop.is_running():
                loop.close()

    async def preload_model(self):
        from .utils import get_sentence_transformer_model
        logger.info("Preloading SentenceTransformer model")
        model = await get_sentence_transformer_model()
        logger.info("Preload completed, model ready")

