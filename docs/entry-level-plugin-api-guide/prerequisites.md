---
title: Prerequisites
---

# Prerequisites

'#### What you will need:

 - An suitable IDE supporting maven. We recommend using either IntelliJ or Eclipse.
 - An internet connection for downloading the Waterdog API Artifacts
 
 
 
 #### Structure

 The base structure of a plugin is really simple. 
 <br>Required parts:
 
 - a plugin.yml file located in the programs resources folder.
 - a base class extending the `Plugin` class and overwriting it's onEnable() method
 
 ![Screenshot_85.png](/img/screenshot-85.png)
 
 **1** - The Base class of the Plugin, mostly named after the plugin itself or from what the plugin is supposed to do. <br>
 **2** - The plugin.yml file containing very basic information on the plugin. <br>
 **3** - A configuration file that the user can use to easily change plugin settings. <br>
 **4** - The base maven file. required to build the plugin and compile it to a runnable file.'
