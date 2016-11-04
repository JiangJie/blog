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

超文本传输协议（英文：HyperText Transfer Protocol，缩写：HTTP）是互联网上应用最为广泛的一种网络协议。<br>
<br>
设计HTTP最初的目的是为了提供一种发布和接收HTML页面的方法。<br>
<br>
通过HTTP或者HTTPS协议请求的资源由统一资源标识符（Uniform Resource Identifiers，URI）来标识。<br>
<br>
HTTP由万维网协会（World Wide Web Consortium，W3C）和互联网工程任务组（Internet Engineering Task Force，IETF）制定标准，现今最广泛使用的是1999年发布的HTTP/1.1。<br>
<br>
——摘自维基百科

[slide]
* ## OSI七层模型
* ## 从认识URL开始
* ## HTTP
    - ### HTTP报文
    - ### HTTP方法
    - ### HTTP状态码
    - ### HTTP缓存
* ## **TLS**
* ## **HTTPS**
* ## **HTTP/2**

[slide]
## OSI七层模型
----
{:&.flexbox.vleft}

应用层 <---- **HTTP**

表示层

会话层 <---- **TLS**

传输层 <---- TCP

网络层 <---- IP

数据链路层

物理层

[slide]
## 从认识URL开始
### 统一资源定位符（Uniform Resource Locator）
----
* 与URI的区别：URL是URI的子集
    - mysql://127.0.0.1:3306/hldn
    - mailto jarvisjiang@tencent.com
    - http://hldn.huanle.qq.com/game/m/index.html?isExternal
* 协议格式：protocol://hostname:port/path?quertstring
    - http
    - https
    - spdy
    - ws
    - wss
* 必须全部是ASCII码，意味着中文等特殊字符需要encode
    - encodeURIComponent('斗牛') === '%E6%96%97%E7%89%9B'
    - 事实上'斗'的utf8编码正是 E6 96 97

[slide]
## HTTP报文
----
{:&.flexbox.vleft}

HTTP报文分为两部分：**Header + Body**<br>
<br>
Header为纯文本，格式如下：
```
METHOD URL HTTP/VERSION
Name: value
```
Body为纯文本或二进制数据，无明确格式，通常和**Content-Type**对应<br>
<br>
以请求https://www.google.com.hk/ 为例

[slide]
### Request
----
{:&.flexbox.vleft}

**----Header----**
```
GET https://www.google.com.hk/ HTTP/1.1
Host: www.google.com.hk
Connection: keep-alive
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2902.0 Safari/537.36
X-Client-Data: CKq1yQEIkbbJAQimtskBCKudygE=
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8
DNT: 1
Accept-Encoding: gzip, deflate, sdch, br
Accept-Language: zh-CN,zh;q=0.8,en;q=0.6,zh-TW;q=0.4
Cookie: SID=xxxxx; HSID=xxxxx; SSID=xxxxx;
```
**注意这里有个空行**

**----Body----**

[slide]
### Response
----
{:&.flexbox.vleft}

**----Header----**
```
HTTP/1.1 200 OK
Date: Mon, 31 Oct 2016 13:26:31 GMT
Expires: -1
Cache-Control: private, max-age=0
Content-Type: text/html; charset=UTF-8
Server: gws
X-XSS-Protection: 1; mode=block
X-Frame-Options: SAMEORIGIN
Alt-Svc: quic=":443"; ma=2592000; v="36,35,34"
Content-Length: 215149
```
**这里同样有空行**

**----Body----**
```
<!doctype html>
以下省略html详细代码
</html>
```

[slide]
## HTTP方法
----
* OPTIONS：用于查询服务器支持哪些方法
* HEAD：只请求响应头
* **GET**：最常用
* **POST**：通常用于创建资源
* PUT：通常用于更新整个资源
* PATCH：通常用于更新资源的一部分
* DELETE：删除资源
* TRACE：可以看到详细的请求过程
* CONNECT：通常留给HTTPS使用

[slide]
### CONNECT www.google.com.hk:443
----
{:&.flexbox.vleft}

**----Request----**
```
CONNECT www.google.com.hk:443 HTTP/1.1
Host: www.google.com.hk:443
Proxy-Connection: keep-alive
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2902.0 Safari/537.36

A SSLv3-compatible ClientHello handshake was found. Fiddler extracted the parameters below.

Version: 3.3 (TLS/1.2)
Random: 4E 0E 68 10 3F 1E C2 B1 EF DA C9 8D 58 D2 C2 71 B1 A3 70 E8 BD 41 BD 01 4A F1 6B CE F9 3E DC 14
...
```
**----Response----**
```
HTTP/1.1 200 Connection established
...
```

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
* **2xx成功**——请求已成功处理
* 3xx重定向——转到其他请求
* 4xx请求错误——出现了权限问题、资源定位问题、政治问题等
* 5xx服务器错误——服务器发生了错误

[slide]
### 常见状态码
----
{:&.flexbox.vleft}

每一个状态码还有一个对应的短语，最常见到的如：<br>
<br>
* 100 Switching Protocols（WebSocket，HTTP/2）
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

**----Response Header----**
```
Cache-Control: max-age=86400
ETag: "fba-4bd1532acf040"
    or
Last-Modified: Sun, 18 Sep 2016 12:04:25 GMT
```
**----Request Header----**
```
If-None-Match: "fba-4bd1532acf040"
    or
If-Modified-Since: Sun, 18 Sep 2016 12:04:25 GMT
```

[slide]
### HTTP的特点
----
* 无状态，意味着每次请求都需要带上完整的Header
* 每条请求都需要创建完整的TCP链接（3次链接握手，4次断开握手）
* 短连接 => 长连接
* 域名最大连接数限制
* 明文
* 可缓存
* 完整性 + 可靠性

[slide]
## TLS(Transport Layer Security)
----
{:&.flexbox.vleft}

---------------------安全性越来越高--------------------->

SSL 1.0 => SSL 2.0 => SSL3.0 ~= TLS 1.0 => TLS 1.1 => TLS 1.2 => TLS 1.3（还未正式发布）

---------------------破解难度越来越高------------------->

[slide]
### TLS握手
----
{:&.flexbox.vleft}
```
TLSv1.2 (OUT), TLS header, Certificate Status (22):
TLSv1.2 (OUT), TLS handshake, Client hello (1):
TLSv1.2 (IN), TLS handshake, Server hello (2):
TLSv1.2 (IN), TLS handshake, Certificate (11):
TLSv1.2 (IN), TLS handshake, Server key exchange (12):
TLSv1.2 (IN), TLS handshake, Server finished (14):
TLSv1.2 (OUT), TLS handshake, Client key exchange (16):
TLSv1.2 (OUT), TLS change cipher, Client hello (1):
TLSv1.2 (OUT), TLS handshake, Finished (20):  
TLSv1.2 (IN), TLS change cipher, Client hello (1):
TLSv1.2 (IN), TLS handshake, Finished (20):
```
以上内容截取自`curl "https://www.google.com.hk/" -I -v`

[推荐阅读TLS技术细节](https://blog.cloudflare.com/keyless-ssl-the-nitty-gritty-technical-details/)

[slide]
```
> curl "https://www.google.com.hk/" -I -v
* timeout on name lookup is not supported
*   Trying 10.14.87.100...
* Connected to dev-proxy.oa.com (10.14.87.100) port 8080 (#0)
* Establish HTTP proxy tunnel to www.google.com.hk:443
> CONNECT www.google.com.hk:443 HTTP/1.1
> Host: www.google.com.hk:443
> User-Agent: curl/7.49.1
< HTTP/1.1 200 Connection established
* Proxy replied OK to CONNECT request   
* ALPN, offering h2
* ALPN, offering http/1.1
* Cipher selection: ALL:!EXPORT:!EXPORT40:!EXPORT56:!aNULL:!LOW:!RC4:@STRENGTH
* successfully set certificate verify locations:
*   CAfile: C:/Program Files/Git/mingw64/ssl/certs/ca-bundle.crt
*   CApath: none 
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
* SSL connection using TLSv1.2 / ECDHE-RSA-AES128-GCM-SHA256
* ALPN, server accepted to use h2 
* Server certificate:
*  subject: C=US; ST=California; L=Mountain View; O=Google Inc; CN=*.google.com.hk
*  start date: Oct 26 09:55:00 2016 GMT
*  expire date: Jan 18 09:55:00 2017 GMT
*  subjectAltName: host "www.google.com.hk" matched cert's "*.google.com.hk"
*  issuer: C=US; O=Google Inc; CN=Google Internet Authority G2
*  SSL certificate verify ok.
* Using HTTP2, server supports multi-use
* Connection state changed (HTTP/2 confirmed)
* TCP_NODELAY set
* Copying HTTP/2 data in stream buffer to connection buffer after upgrade: len=0
* Using Stream ID: 1 (easy handle 0x2959a20)
> HEAD / HTTP/1.1
>...headers
< HTTP/2 200
<...headers
```

[slide]
## HTTPS
### HTTP面临的最大问题——安全
>年轻人，做人做事，安全第一

----
* 明文消息
* 劫持
* 容易被攻击
* 网络嗅探
* 串改

[slide]
### HTTPS = HTTP + TLS
----
* HTTPS使用443默认端口号
* 理论上比HTTP慢，增加了TLS握手
* CA对证书进行签名，由浏览器完成校验
* 证书有有效期，根据客户端时间进行判断
* [Let's Encrypt](https://letsencrypt.org/)
* 中间人攻击（GFW）
* 选择密文攻击
* HSTS（HTTP Strict Transport Security）
    - `Strict-Transport-Security: max-age=31536000; includeSubDomains`

[slide]
## HTTP/2
----
* （必须）使用TLS
* 基于SPDY
* 长连接
* 链接复用
* 二进制帧
* 减少header
* 压缩header

[slide]
### 怎么使用HTTP/2
----
>由Client通过与Server进行协商，确定是否使用HTTP/2

* SPDY——NPN
* HTTP/2——ALPN
* 协商过程与TLS协商同时进行

[slide]
## 抓包工具

### [Fiddler](http://www.telerik.com/fiddler)
>HTTP、HTTPS、FTP

----

### [Wireshark](https://www.wireshark.org/)
>网卡抓包
