import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings

async def drop_enums():
    # Create a temporary engine
    engine = create_async_engine(settings.DATABASE_URL.get_secret_value())
    
    # The SQL commands to clean up the "sticky" types
    commands = [
        "DROP TYPE IF EXISTS otp_purpose_enum CASCADE;",
        "DROP TYPE IF EXISTS user_role_enum CASCADE;",
        "DROP TYPE IF EXISTS user_status_enum CASCADE;"
    ]
    
    async with engine.begin() as conn:
        print("Starting cleanup...")
        for cmd in commands:
            try:
                await conn.execute(text(cmd))
                print(f"Executed: {cmd}")
            except Exception as e:
                print(f"Error executing {cmd}: {e}")
                
    await engine.dispose()
    print("Cleanup complete.")

if __name__ == "__main__":
    asyncio.run(drop_enums())