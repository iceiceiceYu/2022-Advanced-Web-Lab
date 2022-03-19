# Advanced Web Technology Lab1 (ssm demo)

###  ssm-demo code

> 19110240021 夏家峰
>
> 18302010018 俞哲轩

## 概述

1. 此项目包含了一个ssm的实例代码
2. 部署前要先在服务器中制作**maven_tomcat**镜像
3. 需要重点理解`./Dockerfile`文件中的内容

## 注意点

1. 先创建数据库**ssm_demo**，然后执行`./source sys_schema.sql`文件添加表
2. 在`./src/main/resources/resource/jdbc.properties`文件中修改host、用户名和密码等数据库配置

## 截止日期

- 截止时间：**2022.4.3 23:59:59**
- 提交方式：将**文档**提交到超星指定的Lab1作业栏里，文档格式不限
- 提交要求：Lab1提交包括简单的描述文档，自己使用了哪些云计算服务，构建了什么样的web server等
- 评分标准：完成基本内容可以获得基本分数（8分），如果自学并使用了一些扩充功能，可以获得额外加分（1-2分）
