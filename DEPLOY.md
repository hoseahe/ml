# 命理分析系统 - Docker部署文档

## 项目简介

这是一个专业的命理分析Web应用，支持八字命理、紫微斗数和星盘分析。采用前后端分离架构，后端使用Python FastAPI，前端使用原生JavaScript，数据存储使用MySQL。

## 技术栈

- **后端**: Python 3.11 + FastAPI
- **前端**: HTML5 + CSS3 + JavaScript (ES6+)
- **数据库**: MySQL 8.0
- **部署**: Docker + Docker Compose

## 项目结构

```
.
├── Dockerfile              # Docker镜像构建文件
├── docker-compose.yml      # Docker Compose配置文件
├── requirements.txt        # Python依赖包
├── .env.example           # 环境变量配置示例
├── main.py                # FastAPI主程序
├── database.py            # 数据库连接配置
├── models.py              # 数据模型定义
├── routes/                # API路由模块
│   ├── users.py          # 用户管理API
│   ├── birth_info.py     # 出生信息管理API
│   └── analysis.py       # 命理分析API
└── static/                # 前端静态文件
    ├── index.html        # 主页面
    └── js/               # JavaScript模块
        ├── main.js       # 主入口
        ├── api.js        # API封装
        ├── user.js       # 用户模块
        ├── birthInfo.js  # 出生信息模块
        ├── analysis.js   # 分析模块
        └── ui.js         # UI工具模块
```

## 数据库配置

### 数据库信息
- **主机**: 11.142.154.110
- **端口**: 3306
- **数据库名**: 1akmr4xp
- **用户名**: with_rjnreclbvckkitot
- **密码**: 需要在部署时配置

### 数据表结构

系统包含以下数据表：

1. **users** - 用户表
2. **birth_info** - 出生信息表
3. **analysis_records** - 分析记录表

## Docker部署指南

### 方式一：使用 Docker Compose（推荐）

#### 1. 配置环境变量

复制环境变量示例文件并修改：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置MySQL密码：

```bash
MYSQL_PASSWORD=your_actual_password
```

#### 2. 启动服务

```bash
# 构建并启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 3. 访问应用

打开浏览器访问：`http://localhost:8000`

### 方式二：使用 Docker 命令

#### 1. 构建镜像

```bash
docker build -t mingli-analysis:latest .
```

#### 2. 运行容器

```bash
docker run -d \
  --name mingli-analysis-app \
  -p 8000:8000 \
  -e MYSQL_HOST=11.142.154.110 \
  -e MYSQL_PORT=3306 \
  -e MYSQL_DATABASE=1akmr4xp \
  -e MYSQL_USER=with_rjnreclbvckkitot \
  -e MYSQL_PASSWORD=your_password \
  -e APP_ENV=production \
  mingli-analysis:latest
```

#### 3. 查看容器状态

```bash
# 查看运行状态
docker ps

# 查看日志
docker logs -f mingli-analysis-app

# 停止容器
docker stop mingli-analysis-app

# 删除容器
docker rm mingli-analysis-app
```

## 环境变量说明

| 变量名 | 说明 | 默认值 | 必填 |
|--------|------|--------|------|
| MYSQL_HOST | MySQL主机地址 | 11.142.154.110 | 是 |
| MYSQL_PORT | MySQL端口 | 3306 | 是 |
| MYSQL_DATABASE | 数据库名称 | 1akmr4xp | 是 |
| MYSQL_USER | 数据库用户名 | with_rjnreclbvckkitot | 是 |
| MYSQL_PASSWORD | 数据库密码 | - | 是 |
| APP_ENV | 应用环境 | production | 否 |

## 本地开发

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置环境变量

```bash
export MYSQL_HOST=11.142.154.110
export MYSQL_PORT=3306
export MYSQL_DATABASE=1akmr4xp
export MYSQL_USER=with_rjnreclbvckkitot
export MYSQL_PASSWORD=your_password
```

### 3. 启动开发服务器

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. 访问应用

打开浏览器访问：`http://localhost:8000`

## API接口文档

启动服务后，可以访问以下地址查看API文档：

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 主要API端点

#### 用户管理
- `POST /api/users` - 创建/更新用户
- `GET /api/users/{wechat_openid}` - 获取用户信息

#### 出生信息管理
- `POST /api/birth-info` - 添加出生信息
- `GET /api/birth-info/user/{user_id}` - 获取用户的出生信息列表
- `PUT /api/birth-info/{birth_info_id}` - 更新出生信息
- `DELETE /api/birth-info/{birth_info_id}` - 删除出生信息

#### 命理分析
- `POST /api/analysis/bazi` - 八字分析
- `POST /api/analysis/ziwei` - 紫微斗数分析
- `POST /api/analysis/astrology` - 星盘分析
- `GET /api/analysis/history/{birth_info_id}` - 获取分析历史

## 功能特性

### 1. 用户管理
- 模拟登录功能（可替换为真实微信登录）
- 用户信息持久化存储

### 2. 出生信息管理
- 添加多个出生信息记录
- 编辑和删除出生信息
- 支持性别、日期、时间、地点等详细信息

### 3. 命理分析
- **八字分析**: 提供四柱八字排盘、五行分布、命理解析
- **紫微斗数**: 提供十二宫位排盘、主副星分析、命理解读
- **星盘分析**: 提供太阳/月亮/上升星座、行星分布、宫位解析

### 4. 界面特性
- 响应式设计，完美适配移动端（特别是iPhone）
- 现代化UI设计，美观大方
- 流畅的交互体验
- 模块化前端架构

## 故障排查

### 1. 数据库连接失败

检查环境变量配置是否正确：

```bash
docker exec mingli-analysis-app env | grep MYSQL
```

查看应用日志：

```bash
docker logs mingli-analysis-app
```

### 2. 端口被占用

修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "8080:8000"  # 将主机端口改为8080
```

### 3. 容器无法启动

检查Docker日志：

```bash
docker-compose logs
```

重新构建镜像：

```bash
docker-compose build --no-cache
docker-compose up -d
```

## 性能优化建议

1. **数据库连接池**: 当前使用简单连接，生产环境建议使用连接池
2. **缓存**: 可以添加Redis缓存分析结果
3. **CDN**: 静态资源可以使用CDN加速
4. **负载均衡**: 高并发场景下可以部署多个实例

## 安全建议

1. **密码管理**: 不要将密码提交到代码仓库
2. **HTTPS**: 生产环境建议使用HTTPS
3. **防火墙**: 配置防火墙规则，限制数据库访问
4. **定期备份**: 定期备份数据库数据

## 更新日志

### v1.0.0 (2026-01-07)
- 初始版本发布
- 支持八字、紫微、星盘三种分析
- 完整的用户和出生信息管理
- Docker部署支持

## 技术支持

如有问题，请查看：
- API文档: `http://localhost:8000/docs`
- 项目日志: `docker logs mingli-analysis-app`

## 许可证

本项目仅供学习和研究使用。
