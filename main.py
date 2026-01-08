from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from routes import users, birth_info, analysis

app = FastAPI(title="命理分析系统")

# CORS配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(users.router)
app.include_router(birth_info.router)
app.include_router(analysis.router)

# 根路径重定向
@app.get("/")
async def root():
    return RedirectResponse(url="/static/index.html")

# 挂载静态文件（必须在最后）
app.mount("/static", StaticFiles(directory="static", html=True), name="static")
