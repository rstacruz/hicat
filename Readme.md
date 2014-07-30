hicat
=====

`cat` with syntax highlighting. Auto-detects the language via the file 
extension, or tries to infer it automatically.

    hicat index.js

Pipe something to `hicat`. It will figure out what language it is in.

    curl http://site.com | hicat

If hicat fails to detect a language, explicitly pass it `-t TYPE`.

    curl http://site.com | hicat -t xml

Installation
------------

    $ npm install -g hicat

Usage:

    $ hicat --help

      Usage:
          hicat [options] [file]
          ... | hicat [options]

      Options:
          -h, --help         print usage information
          -v, --version      show version info and exit
          -t, --type TYPE    use a given file type

Thanks
------

**hicat** © 2014+, Rico Sta. Cruz. Released under the [MIT License].<br>
Authored and maintained by Rico Sta. Cruz with help from [contributors].

> [ricostacruz.com](http://ricostacruz.com) &nbsp;&middot;&nbsp;
> GitHub [@rstacruz](https://github.com/rstacruz) &nbsp;&middot;&nbsp;
> Twitter [@rstacruz](https://twitter.com/rstacruz)

[MIT License]: http://mit-license.org/
[contributors]: http://github.com/rstacruz/hicat/contributors
