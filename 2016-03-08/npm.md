![NPM](https://camo.githubusercontent.com/3fd81ee99a8ca86aee5e7450cb41b40b0d6f8da5/687474703a2f2f7777772e616c6c6f797465616d2e636f6d2f77702d636f6e74656e742f75706c6f6164732f323031362f30332f6e706d2e706e67)

npm本来是Node.js的包管理工具，而现在几乎是所有跟JS相关的工具和软件的包管理工具。

npm所有的命令几乎都可以通过`npm cmd --option`的方式使用。

一切都从`npm -h`开始。
# npm -h

学习一个工具，最简单直接的方式就是查看它的用户手册，npm提供了并不算很详细的命令行手册，可以通过`npm -h`查看，需要某个npm命令更详细的文档则需要通过`npm help cmd`如`npm help install`来查看。

另外`npm cmd -h`也是一个快速查看命令可以怎么使用和搭配哪些常用选项的方法。

npm install -h
npm config -h

# npm init
npm init -y

# npm install
npm i
npm i react
npm i react -g
npm i react -S
npm i react -D

# npm publish
npm login

# npm2 & npm3
按照官方文档介绍，npm3处理模块依赖的方式跟npm2很不一样。

已经使用过npm3的肯定会发现，npm3将依赖模块扁平化了，node_modules文件夹里面子文件夹增多了，出现了很多没有通过`npm install`安装过的模块。而且npm3刚发布的时候，普遍反映安装模块很慢。