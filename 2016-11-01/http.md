title: HTTP
speaker: JarvisJiang
transition: zoomin
date: 2016.11.04
theme: moon

[slide]
# HTTP & HTTPS
## JarvisJiang
#### 2016.11.04

[slide]{:&.flexbox.vleft}

超文本传输协议（英文：HyperText Transfer Protocol，缩写：HTTP）是互联网上应用最为广泛的一种网络协议。

<br>

设计HTTP最初的目的是为了提供一种发布和接收HTML页面的方法。

<br>

通过HTTP或者HTTPS协议请求的资源由统一资源标识符（Uniform Resource Identifiers，URI）来标识。

<br>

HTTP由万维网协会（World Wide Web Consortium，W3C）和互联网工程任务组（Internet Engineering Task Force，IETF）制定标准，现今最广泛使用的是1999年发布的HTTP/1.1。

<br>

——摘自维基百科

[slide]
## 目录
----
* OSI七层模型
* 从认识URL开始
* HTTP报文
* HTTP方法
* HTTP状态码
* HTTP缓存
* TLS
* HTTPS
* HTTP/2

[slide]
## OSI七层模型
----
{:&.flexbox.vleft}

应用层 <---- **HTTP**

表示层

会话层 <---- TLS

传输层 <---- TCP

网络层 <---- IP

数据链路层

物理层

[slide]
## 从认识URL开始
### 统一资源定位符（Uniform Resource Locator）
----
* 与URI的区别：可以看做是URI的子集
    - mysql://127.0.0.1:3306/hldn
    - mailto jarvisjiang@tencent.com
    - ...
* 协议格式：protocol://hostname:port/path?quertstring
    - http
    - https
    - http://hldn.huanle.qq.com/game/m/index.html?isExternal
* 必须全部是ASCII码，意味着中文等特殊字符需要encode
    - encodeURIComponent('斗牛') === '%E6%96%97%E7%89%9B'

[slide]
## HTTP报文
----
以请求https://www.google.com.hk/为例

[slide]
### Request
----
{:&.flexbox.vleft}

GET https://www.google.com.hk/ HTTP/1.1<br>
Host: www.google.com.hk<br>
Connection: keep-alive<br>
Upgrade-Insecure-Requests: 1<br>
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2902.0 Safari/537.36<br>
X-Client-Data: CKq1yQEIkbbJAQimtskBCKudygE=<br>
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8<br>
DNT: 1<br>
Accept-Encoding: gzip, deflate, sdch, br<br>
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4<br>
Cookie: SID=xxxxx; HSID=xxxxx; SSID=xxxxx;<br>
**注意这里有个空行**

[slide]
### Response
----
{:&.flexbox.vleft}

HTTP/1.1 200 OK<br>
Date: Mon, 31 Oct 2016 13:26:31 GMT<br>
Expires: -1<br>
Cache-Control: private, max-age=0<br>
Content-Type: text/html; charset=UTF-8<br>
Server: gws<br>
X-XSS-Protection: 1; mode=block<br>
X-Frame-Options: SAMEORIGIN<br>
Alt-Svc: quic=":443"; ma=2592000; v="36,35,34"<br>
Content-Length: 215149<br>
**这里同样有空行**

<!doctype html>以下省略html详细代码

[slide]
## HTTP方法
----
* OPTIONS：用于查询服务器支持哪些方法
* HEAD：只请求响应头
* GET：最常用
* POST：通常用于创建资源
* PUT：通常用于更新整个资源
* PATCH：通常用于更新资源的一部分
* DELETE：删除资源
* TRACE：可以看到详细的请求过程
* CONNECT：通常HTTPS会使用

[slide]
### CONNECT www.google.com.hk:443
----
{:&.flexbox.vleft}

**Request**

CONNECT www.google.com.hk:443 HTTP/1.1<br>
Host: www.google.com.hk:443<br>
Proxy-Connection: keep-alive<br>
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2902.0 Safari/537.36<br>

A SSLv3-compatible ClientHello handshake was found. Fiddler extracted the parameters below.<br>

Version: 3.3 (TLS/1.2)<br>
Random: 4E 0E 68 10 3F 1E C2 B1 EF DA C9 8D 58 D2 C2 71 B1 A3 70 E8 BD 41 BD 01 4A F1 6B CE F9 3E DC 14<br>
...

**Response**

HTTP/1.1 200 Connection established<br>
...

[slide]{:&.flexbox.vleft}

**安全方法**
----
只读的请求，如HEAD，GET

**幂等方法**
----
多次请求与单次请求对服务器的影响相同，如HEAD，GET，DELETE

[slide]
## 状态码
----
* 1xx消息——请求已被服务器接收，继续处理中
* 2xx成功——请求已成功处理
* 3xx重定向——转到其他请求
* 4xx请求错误——出现了权限问题、资源定位问题、政治问题等
* 5xx服务器错误——服务器发生了错误

[slide]
### 常见状态码
----
{:&.flexbox.vleft}

每一个状态码还有一个对应的短语，最常见到的如：
* 100 Continue（WebSocket）
* 200 OK
* 206 Partial Content（大文件分段下载）
* 302 Found（重定向）
* 304 Not Modified（缓存）
* 403 Forbidden
* 404 Not Found
* 500 Internal Server Error
* 502 Bad Gateway
* 504 Gateway Timeout

[slide]
## HTTP缓存
### Cache-Control && ETag
----
{:&.flexbox.vleft}

**Response**

Cache-Control: max-age=86400<br>
ETag: "fba-4bd1532acf040"<br>
Last-Modified: Sun, 18 Sep 2016 12:04:25 GMT

**Request**

If-None-Match: "fba-4bd1532acf040"<br>
If-Modified-Since: Sun, 18 Sep 2016 12:04:25 GMT

[slide]
## TLS
----
{:&.flexbox.vleft}

---------------------安全性越来越高--------------------->

SSL 1.0 => SSL 2.0 => SSL3.0 ~= TLS 1.0 => TLS 1.1 => TLS 1.2 => TLS 1.3（还未正式发布）

---------------------破解难度越来越高------------------->

[slide]
### TLS握手
----
* TLSv1.2 (OUT), TLS header, Certificate Status (22):
* TLSv1.2 (OUT), TLS handshake, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Server hello (2):
* TLSv1.2 (IN), TLS handshake, Certificate (11):
* TLSv1.2 (IN), TLS handshake, Server key exchange (12):
* TLSv1.2 (IN), TLS handshake, Server finished (14):
* TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
* TLSv1.2 (OUT), TLS change cipher, Client hello (1):
* TLSv1.2 (OUT), TLS handshake, Finished (20):  
* TLSv1.2 (IN), TLS change cipher, Client hello (1):
* TLSv1.2 (IN), TLS handshake, Finished (20):

[推荐一读](https://blog.cloudflare.com/keyless-ssl-the-nitty-gritty-technical-details/)

[slide]
## HTTPS

[slide]
## HTTP/2
