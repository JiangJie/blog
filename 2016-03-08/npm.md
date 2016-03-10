![NPM](https://camo.githubusercontent.com/3fd81ee99a8ca86aee5e7450cb41b40b0d6f8da5/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031362f30332f6e706d2e706e67)

[npm](https://www.npmjs.com/)本来是Node.js的包管理工具，但随着JS这几年的蓬勃发展，现在的npm已经成了几乎所有跟JS相关的工具和软件包的管理工具了，并且还在不断发展完善中。

本文从笔者的经验，总结了npm`安装/卸载、更新、发布`这几个最主要功能的正确使用姿势和一些小技巧，顺便从官网搬来了npm3处理依赖的重大变化。

# npm3

npm团队已经发布了npm3，近期有小伙伴吐槽npm3安装软件包的时候很慢，一开始笔者也感觉相比npm2慢了不少，但经过了几个版本的迭代，速度似乎又快起来了。

慢的同学是时候更新你的npm啦，而且之前安装进度条模糊成一坨的问题也已经修复了。

##### npm v3.0安装react的截图

![npm 3.0](https://camo.githubusercontent.com/6fc5efba05f7d4ab3e760e3a7027ca69151d7511/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031362f30332f6e706d332e302e706e67)

##### npm v3.8安装react的截图

![npm 3.8](https://camo.githubusercontent.com/b271181fdaa5eacb04ad7b8739e1349541dde66d/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031362f30332f6e706d332e382e706e67)

npm提供了大量的命令，所有的命令几乎都可以通过`npm cmd [options]`的方式使用。

# npm -h

学习一个命令行工具，最简单直接的方式就是查看它的用户手册，npm提供了并不算很详细的命令行手册，可以通过`npm -h`查看（unix用户还可以通过`man npm`查看，相对来说比windows详细多了），需要某个npm命令更详细的文档则需要通过`npm help cmd`如`npm help install`来查看，注意不是 ~~`npm install help`~~ ，这样将会安装help包。

另外`npm cmd -h`也是一个快速查看命令可以怎么使用和搭配哪些常用选项的方法。

# npm init

说到npm就不得不说package.json，每一个npm包都必须有一个package.json文件，年轻时候的我还傻乎乎的从其他地方拷贝package.json过来然后修改，为了自动化还写了个自动生成的脚本。

后来才发现原来npm自带此功能，官方原厂功能更好更强大，只需要执行`npm init`即可，以交互方式完成package.json的创建。

如果想生成默认package.json，可以执行`npm init -y`，连交互式界面都不会出现。

另外需要注意，`npm init`的时候需要输入用户字段，如果还没有设置npm用户，需要通过`npm addUser`设置。

事实上，最小单位的npm包就是只包含一个package.json文件的包，这样的话`npm init`就完成了一个npm包的创建。

# npm install/uninstall

`npm install`作为npm最重要的功能和最常用的功能，不用过多说明，这里只介绍三个非常有用的选项`--global`，`--save`，`--save-dev`。

想必读者肯定知道`--global`可以简写成`-g`，其实另外两个选项也有简写形式，`--save`可以简写成`-S`，`--save-dev`可以简写成`-D`，注意大写。

另外`npm install`也可以简写成`npm i`，相应的卸载命令`npm uninstall`可以简写成`npm un`，事实上npm的很多命令和选项在设计上都非常类似unix上的命令行功能，这里指的是命令和选项都可以极大化地简写，只要在不混淆的情况下。

`npm uninstall`和`npm install`接受同样的选项和参数。

`--save`的作用是在packaje.json的dependencies字段增加或者修改一个安装包和版本号名值对，`--save-dev`则是修改devDependencies，这样就不用安装了某个包之后手动修改package.json，npm已经帮我们把包依赖和版本管理做好了。

以安装react为例，

`npm i react -S`将为package.json增加

```javascript
"dependencies": {
  "react": "^0.14.7"
}
```

`npm i react -D`将增加

```javascript
"devDependencies": {
  "react": "^0.14.7"
}
```

# npm update

假如react@15（版本号，下同）发布了，想尝鲜的小伙伴该怎么更新呢？

首先得知道npm上是否已经更新，`npm info react`可以查看到react在npm上发布过哪些版本以及最新的版本，但是内容太多，让人眼花缭乱，配合grep会好一些。

其实我们只想知道react最新的版本，使用`npm dist-tags ls react`直接列出react发布过哪些tag，

```javascript
> npm dist-tags ls react
0.10.0-rc1: 0.10.0-rc1
0.11.0-rc1: 0.11.0-rc1
latest: 0.14.7
next: 15.0.0-rc.1
```

以及这些tag目前最新是哪些版本，比如最常用的latest，也是默认tag。

next tag已经发布了react@15的第一个rc版了，尝鲜的朋友可以试一试了。

另外一个命令`npm outdated`，会检测当前安装的所有npm包是否有更新，并列出可以更新的包，如果没有任何输出，那么恭喜你，所有的包都是不需要更新的。

如果之前安装的react版本是0.14.3，同时还安装了redux@3.2.0，执行`npm outdated`会输出

```javascript
Package  Current  Wanted  Latest  Location
react     0.14.3  0.14.7  0.14.7  example
redux      3.2.0   3.3.1   3.3.1  example
```

这种情况则说明react和redux该更新了，更新具体某个包使用`npm update package_name`即可，`npm update`则会更新所有可更新的包。

# npm publish

npm作为一个大仓库，每天都有大量的新包发布上来，发布自己的包非常容易，而且几乎零门槛，对应的发布的命令是`npm publish`，但前提是你需要一个npm账号。

假设已经有账号了，在发布之前需要使用`npm login`进行登录，正式发布之前请先阅读以下关于版本号的介绍。

npm包的版本号一般都是`x.y.z`的形式。

其中x表示主版本号，通常有重大改变或者达到里程碑才改变；

y表示次要版本号，或二级版本号，在保证主体功能基本不变的情况下，如果适当增加了新功能可以更新此版本号；

z表示尾版本号或者补丁号，一些小范围的修修补补就可以更新补丁号。

第一版本通常是0.0.1或者1.0.0，当修改了代码，需要更新版本号重新发布到npm，不知道的小伙伴（年轻的我）肯定会手动修改package.json的version字段，而高级的玩法是直接使用`npm version <update_type>`命令自动搞定。

详细用法可通过`npm help version`查看，这里只介绍最常用的三种。

```javascript
npm version patch => z+1
npm version minor => y+1 && z=0
npm version major => x+1 && y=0 && z=0
```

三个选项分别对应三部分的版本号，每次运行命令会导致相应的版本号递增一，同时子版本号清零。

如果npm包同时又是一个git仓库，在运行了`npm version <update_type>`和`npm publish`之后，npm会自动给git仓库打上一个跟当前版本号一样的tag，对于挂在github上的npm包很有用。

# npm2 & npm3
上面介绍了npm包安装/卸载、更新和发布，几乎能满足日常使用了，另外再搬点干货过来。

npm3虽然慢，但解决了windows上npm包目录太深的问题，相信使用过npm1或者npm2的都知道，node_modules太多太深了，甚至一不小心就超过windows资源管理器能处理的最长路径长度了，听起来有点拗口，说白了这时候复制粘贴删除就会报错了。

已经使用过npm3的肯定会发现，npm3将依赖模块扁平化存放了，node_modules文件夹里面子文件夹增多了，出现了很多没有通过`npm install`安装过的模块。

npm3在安装包的时候，由于每个包和包的依赖都会去计算是否需要再安装，搜索起来确实变慢了，好在至少现在的npm3速度还是可以接受的。

按照官方文档介绍，npm3处理模块依赖的方式跟npm2很不一样。

> 以下是从[官网](https://docs.npmjs.com/how-npm-works/npm3-nondet)搬的砖

### npm的依赖

假如我们写了个模块App，需要安装两个包A@1和C@1，其中A@1依赖另一个包B@1，C@1依赖B@2，用npm2和npm3安装之后的依赖图分别是这样的

![npm3dependencies](https://camo.githubusercontent.com/6f9fc98fb2985a8c0d3883d2ad59f7a5acfe9d1c/68747470733a2f2f646f63732e6e706d6a732e636f6d2f696d616765732f6e706d3364657073342e706e67)

npm3按照安装顺序存放依赖模块，先安装A@1，发现依赖模块B@1没有安装过也没有其他版本的B模块冲突，所以B@1存放在第一级目录，B@2为了避免和B@1的冲突，还是继续放在C@1之下。

npm2没什么好说的，来什么安装什么，根本不用理会公共依赖关系，依赖模块一层一层往下存放就是了，下面重点讲解npm3在这方面的改进。

现在App又需要安装一个包D@1，D@1依赖B@2，使用npm3安装之后，包结构将变成下面这样

![npm3dependencies-1](https://camo.githubusercontent.com/e61e0ace80a5b44003b0c6ff9d65f5d88772edb6/68747470733a2f2f646f63732e6e706d6a732e636f6d2f696d616765732f6e706d3364657073362e706e67)

虽然C@1和D@1都依赖B@2，但是由于A@1先安装，A@1依赖的B@1已经安装到第一级目录了，后续需要安装的所有包B，只要版本不是1，都需要避免和B@1的冲突，所以只能像npm2一样，安装在相应包下面。

接着又安装了一个E@1，依赖B@1，因为B@1已经安装过，且不会有版本冲突，这时候就不用重复安装B@1了，包结构会变成这样

![npm3dependencies-2](https://camo.githubusercontent.com/f1b0a85f8ff98f7899a3e0995541a7c868e5ce49/68747470733a2f2f646f63732e6e706d6a732e636f6d2f696d616765732f6e706d3364657073382e706e67)

随着App升级了，需要把A@1升级到A@2，而A@2依赖B@2，把E@1升级到E@2，E@2也依赖B@2，那么B@1将不会再被谁依赖，npm将卸载B@1，新的包结构将变成这样

![npm3dependencies-3](https://camo.githubusercontent.com/ec5b15a3da040184f8defcf2f21b034e8e58ab31/68747470733a2f2f646f63732e6e706d6a732e636f6d2f696d616765732f6e706d336465707331322e706e67)

可以看到出现了冗余，结果跟预期的不一样，既然所有对B的依赖都是B@2，那么只安装一次就够了。

### npm dedupe

npm在安装包的时候没有这么“智能”，不过`npm dedupe`命令做的事就是重新计算依赖关系，然后将包结构整理得更合理。

执行一遍`npm dedupe`将得到

![npm3dependencies-4](https://camo.githubusercontent.com/766485ddf78c4dd9e2cffae6d6e2917ee8f9a1b5/68747470733a2f2f646f63732e6e706d6a732e636f6d2f696d616765732f6e706d336465707331332e706e67)

这才是最优且符合预期的结构，看来在每次安装/卸载了包之后最好重新执行`npm dedupe`，以保证包结构是最优的。

npm3通过将依赖模块扁平化安装，避免了冗余又解决了windows上一大头疼问题。