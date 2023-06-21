#!/bin/bash

# This solution checks whether an argument "installmode" is passed when running 
# the script. If so, it sets a variable `FIREGEM_HOME` to `/usr/local/firegem`. 
# Otherwise, it prompts the user for an installation directory using the command 
# line parameter `$ARENCM_DIR`, which can be set by passing `-e` option while 
# calling this script with arguments or setting environment variables before 
# executing it. The value of $ARENCM_DIR will overwrite FIREGEM_HOME if not 
# empty after reading from standard input and checking that its length is 
# greater than zero (to avoid errors). Finally, the script checks whether the 
# current user has write access to the Firegem home directory (`$FIREGEM_HOME`) 
# and executes itself as a script either with `sudo` or without depending on the 
# result of the check.

sudo mkdir -p /usr/local/firegem
sudo rsync -ravl admin /usr/local/firegem/
sudo rsync -ravl lib /usr/local/firegem/
sudo rsync -ravl web /usr/local/firegem/
sudo rsync -ravl extensions /usr/local/firegem/
sudo rsync -ravl *.php /usr/local/firegem/
sudo rsync -ravl init.sh /usr/local/firegem/
sudo rsync -ravl /usr/local/firegem/lib/install.php /usr/local/firegem/
exit

# Below is an experimental installer

# Check if install mode is enabled
if [ "$1" = 'installmode' ] && [ "$2" != "" ]; then
    # Set the Firegem home directory to /usr/local/firegem
    FIREGEM_HOME=$2
    echo "Have something $FIREGEM_HOME"
    exit
else
	FIREGEM_HOME="/usr/local/firegem"
	echo "Doing default $FIREGEM_HOME"
	
	# Prompt user for installation directory and set it as $FIREGEM_DIR
	echo "Enter an installation directory (or press CTRL+D when finished): "
	read FIREGEM_HOME
	
	#FIREGEM_HOME=$(echo $FIREGEM_HOME | sed 's/\//\\\//g') # converting // to \/ so we can use it inside a string literal
fi

# Make parent directory available
FIREGEM_PARENT="${FIREGEM_HOME%/*}"

if [ ! -d "$FIREGEM_PARENT" ]; then
    echo "Directory does not exist: $FIREGEM_PARENT"
else
    if [[ $(stat -c %u:%w ${FIREGEM_PARENT}) ]]; then
        echo "Folder is writable by all users: $FIREGEM_PARENT"
    else
        echo "Folder has insufficient permissions for this command. Please run as root or with sudo privileges."
    fi
fi

exit

# Check if user has write access to $FIREGEM_HOME and execute script with sudo or without it accordingly
if [ ! $(ls -ld "$FIREGEM_PARENT") ]; then
    exec sudo bash "${0} installmode $FIREGEM_PARENT $FIREGEM_HOME"
else
    bash "${0} installmode $FIREGEM_PARENT $FIREGEM_HOME"
fi


