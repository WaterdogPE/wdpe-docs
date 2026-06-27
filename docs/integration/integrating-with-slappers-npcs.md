---
title: Integrating with slappers / NPCs
---

# Integrating with slappers / NPCs

## Goal
Many want to integrate WaterdogPE with NPCs to be able to transfer players by clicking an NPC.

## General integration
The integration can easily be done by running a command to transfer the player. You can either run that command sudoing the user or supply a player argument. <br>
Optionally, if you have your own NPC plugin, you can just implement the transfer method in the code.

### PMMP3 slapper
Integration with PM3's famous slapper plugin is quite simple. First of all, make sure you have a plugin on your PM server that implements a transfer command. For example:

- [TransferAPI](https://github.com/BlckqPlugins/TransferAPI)

After you have that plugin installed, you can simply add the transfer command with your desired arguments to the NPC.

## Common mistake
The most common mistake is that people try to use `/wdsend`. **That won't work, because `/wdsend` is a proxy command and is not known to the downstream server.** Run a *downstream* transfer command from the NPC instead.
