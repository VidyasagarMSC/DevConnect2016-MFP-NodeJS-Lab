#!/usr/bin/env node

/*
* Add and Remove Build properties for ios projects.
*/

var fs = require('fs');
var path = require('path');
// cant use context.requireCordovaModule, the version of xcode might be too old inside cordova-lib
var xcode = require('xcode');

function addBuildProperty(context, prop, value, build_name){
  var projectRoot = path.resolve(context.opts.projectRoot);
  var ConfigParser = context.requireCordovaModule('cordova-lib').configparser;
  var config = new ConfigParser(path.join(projectRoot, 'config.xml'));
  var projectName = config.name();
  var projectPath = path.join(projectRoot, 'platforms/ios/', projectName+'.xcodeproj','project.pbxproj');
  var myProj = xcode.project(projectPath);
  
  //we need to use Sync because async causes problems when other plugins are handling pbxproj file
  myProj.parseSync();
  myProj.addBuildProperty(prop, value,build_name);
  fs.writeFileSync(projectPath, myProj.writeSync());
  console.log('✔ ', prop,value);
}
function removeBuildProperty(context, prop, build_name){
  var projectRoot = path.resolve(context.opts.projectRoot);
  var ConfigParser = context.requireCordovaModule('cordova-lib').configparser;
  var config = new ConfigParser(path.join(projectRoot, 'config.xml'));
  var projectName = config.name();
  var projectPath = path.join(projectRoot, 'platforms/ios/', projectName+'.xcodeproj','project.pbxproj');
  var myProj = xcode.project(projectPath);
  
  //we need to use Sync because async causes problems when other plugins are handling pbxproj file
  myProj.parseSync();
  myProj.removeBuildProperty(prop, build_name);
  fs.writeFileSync(projectPath, myProj.writeSync());
  console.log('✔ ',prop,'removed');
}

module.exports = {
 "addBuildProperty":addBuildProperty,
 "removeBuildProperty":removeBuildProperty
};
