# grunt-releasetag

> "Tag a release and update a CHANGES file"

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-releasetag --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-releasetag');
```

## The "releasetag" task

### Overview
In your project's Gruntfile, add a section named `releasetag` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  releasetag: {
    options: {
      createTag: true, // create a git tag, defaults to TRUE
      updateChanges: true, // updateChanges, defaults to TRUE
      semverIncrement: 'minor' // the sem-ver type of default increment, defaults to 'minor'
    }
  }
})
```

### Options

#### options.createTag
Type: `Boolean`
Default value: `true`

Whether to create the git tag, in the form `v1.2.3`

#### options.updateChanges
Type: `Boolean`
Default value: `true`

Whether to update a CHANGES file with all the commit messages since the last release

#### options.semverIncrement
Type: `String` | `Boolean`
Default value: `minor`

One of 'patch', 'minor' or 'major' - the default kind of Semantic Versioning increment.  Can be overridden by calling `grunt releasetag:major` etc.  Disabled by using 'none' or a falsey value (`false`, 0, etc)

### Usage Examples

#### Default Options
In this example, the default options are used to create the tag and update the CHANGES file. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  releasetag: {}
})
```

#### Custom Options
Set a default increment of 'patch', and then override when calling by using `grunt releasetag:major` to get a major increment

```js
grunt.initConfig({
  releasetag: {
    options: {
      semverIncrement: 'patch'
    }
  },
})
```

```js
grunt releasetag:major
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
