/*
 * grunt-releasetag
 * https://github.com/pete-otaqui/releasetag
 *
 * Copyright (c) 2013 Pete Otaqui
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  var TempFile = require('temporary/file'),
      semver = require('semver'),
      execSync = require('execSync'),
      exec = require('child_process').exec,
      tmpfile = new TempFile();

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  // grunt.registerMultiTask('releasetag', 'Create a release tag, bump the version number with semver and update a CHANGES', function() {
  //   // Merge task-specific and/or target-specific options with these defaults.
  //   var options = this.options({
  //     createTag: true,
  //     updateChanges: true,
  //     semverIncrement: 'minor'
  //   });

  //   // Iterate over all specified file groups.
  //   this.files.forEach(function(f) {
  //     // Concat specified files.
  //     var src = f.src.filter(function(filepath) {
  //       // Warn on and remove invalid source files (if nonull was set).
  //       if (!grunt.file.exists(filepath)) {
  //         grunt.log.warn('Source file "' + filepath + '" not found.');
  //         return false;
  //       } else {
  //         return true;
  //       }
  //     }).map(function(filepath) {
  //       // Read file source.
  //       return grunt.file.read(filepath);
  //     }).join(grunt.util.normalizelf(options.separator));

  //     // Handle options.
  //     src += options.punctuation;

  //     // Write the destination file.
  //     grunt.file.write(f.dest, src);

  //     // Print a success message.
  //     grunt.log.writeln('File "' + f.dest + '" created.');
  //   });
  // });
  



  grunt.registerTask('releasetag', 'Create a release tag, bump the version number with semver and update a CHANGES', function(type) {
        var done = this.async(),
            current_version = grunt.config('pkg').version,
            new_version,
            current_tag = 'v'+current_version,
            new_tag,
            log_command,
            changes,
            // Merge task-specific and/or target-specific options with these defaults.
            options = this.options({
              createTag: true,
              updateChanges: true,
              semverIncrement: 'minor'
            });
        if ( arguments.length === 0 ) {
            type = 'minor';
        }
        new_version = semver.inc(current_version, type);
        new_tag = 'v'+new_version;

        grunt.log.writeln('Updating CHANGES for '+new_version);
        execSync.stdout('echo "VERSION '+new_version+'" > '+tmpfile);
        execSync.stdout('echo "" >> '+tmpfile);

        changes = execSync.stdout(get_git_log_command(current_tag));

        execSync.stdout('echo "" >> '+tmpfile);
        execSync.stdout('echo "" >> '+changes);
        execSync.stdout('echo "" >> '+tmpfile);
        execSync.stdout('echo "" >> '+tmpfile);
        execSync.stdout('cat CHANGES >> '+tmpfile);
        execSync.stdout('mv '+tmpfile+' CHANGES');

        update_version_value('package.json', new_version);
        update_version_value('cbeebies-ugly-duckling.json', new_version);

        
        
        grunt.log.writeln('git:');
        grunt.log.writeln(' - adding files');
        exec('git add CHANGES package.json cbeebies-ugly-duckling.json', function(e, so, se) {
            grunt.log.writeln(' - committing changed');
            exec('git commit -m "updated CHANGES and version number for '+new_version+'"', function(e, so, se) {
                grunt.log.writeln(' - creating tag '+new_tag);
                exec('git tag '+new_tag, function() {
                    grunt.log.writeln(' - pushing to origin');
                    exec('git push origin --tags', function() {
                        done();
                    });
                });
            });
        });
    });

    function get_git_log_command(version1, version2) {
        var log_command;
        if ( arguments.length === 1 ) {
            version2 = 'HEAD';
        }
        log_command = 'git log --pretty=format:" - %s" ';
        log_command += version1;
        log_command += '..';
        log_command += version2;
        log_command += ' >> '+tmpfile;
        return log_command;
    }

    function update_version_value(file, new_version) {
        var f = grunt.file.readJSON( file );
        f.version = new_version;
        grunt.file.write( file, JSON.stringify( f, null, 2 ) );
    }
};
