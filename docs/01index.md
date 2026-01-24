>本文档利用AI 的分层推理能力，手动构建上下文，链接采用obsidian的链接，需要的内容去索引对应的上下文。

[[项目愿景]]
本项目是一个外贸电商网站，使用一个后台管理完成对多个不同网站进行管理，后台管理是一个前后端分离项目，客户端是一个全栈一体项目。


[[核心技术栈]]
[[shop-Docs/multi-site-architecture|multi-site-architecture]]
需要记住本项目核心开发流程是SSOT瀑布流。

### SSOT 瀑布流 (SSOT Waterfall)
全栈系统开发以数据库为唯一事实来源（Single Source of Truth），数据流向为：
- **数据库层 (DB Layer)**
- **对象关系映射层 (ORM Layer)**
- **契约层 (Contract Layer)**
- **服务层 (Service Layer)**
- **控制器层 (Controller Layer)**
- **应用程序接口钩子层 (API-Hooks Layer)**


[[模块依赖图]]




[[项目依赖文档]] : dirzzle  eden  


[[命名系统]]
[[shop-Docs/model-naming-standards|model-naming-standards]]

