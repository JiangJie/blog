![NPM](https://camo.githubusercontent.com/3fd81ee99a8ca86aee5e7450cb41b40b0d6f8da5/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031362f30332f6e706d2e706e67)

npm本来是Node.js的包管理工具，而现在几乎是所有跟JS相关的工具和软件的包管理工具。

npm所有的命令几乎都可以通过`npm cmd --option`的方式使用。

一切都从`npm -h`开始。
# npm -h

学习一个工具，最简单直接的方式就是查看它的用户手册，npm提供了并不算很详细的命令行手册，可以通过`npm -h`查看，需要某个npm命令更详细的文档则需要通过`npm help cmd`如`npm help install`来查看，注意不是~~`npm install help`。

另外`npm cmd -h`也是一个快速查看命令可以怎么使用和搭配哪些常用选项的方法。

npm install -h
npm config -h

# npm init
npm addUser
npm init -y

# npm install
npm i
npm i react
npm i react -g
npm i react -S
npm i react -D

# npm update
npm outdated

# npm publish
npm login

npm包版本号一般都是`x.y.z`的形式。

其中x表示主版本号，通常有重大改变或者达到里程碑才改变；
y表示次要版本号，或二级版本号，在保证主体功能基本不变的情况下，如果适当增加了新功能可以更新此版本号；
z表示尾版本号或者补丁号，一些小范围的修修补补就可以更新此版本号。

当修改了代码，想更新版本号重新发布到npm，不知道的同学肯定会手动修改package.json的version字段，而高级的玩法是直接使用`npm version <update_type>`命令自动搞定。

详细用法可通过`npm help version`查看，这里只介绍最常用的三种。

```javascript
npm version patch => z+1
npm version minor => y+1 && z=0
npm version major => x+1 && y=0 && z=0
```

三个选项分别对应三部分的版本号，每次运行命令会导致相应的版本号递增一，同时后面的版本号清零。

如果同时npm包又是一个git仓库，在运行了`npm version <update_type>`和`npm publish`之后，npm会自动给git仓库打上一个跟当前版本号一样的tag。

# npm2 & npm3
按照官方文档介绍，npm3处理模块依赖的方式跟npm2很不一样。

已经使用过npm3的肯定会发现，npm3将依赖模块扁平化了，node_modules文件夹里面子文件夹增多了，出现了很多没有通过`npm install`安装过的模块。而且npm3刚发布的时候，普遍反映安装模块很慢。