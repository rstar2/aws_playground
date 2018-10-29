#!/usr/bin/env bash

echo "-- Cleanup ClamAV local folder --"
rm -rf clamav
# For Windows
rm -rf c:\\Users/clamav

echo "-- Download AmazonLinux image --"
docker pull amazonlinux

echo "-- Create AmazonLinux container from the image --"
# Note - Mounted host volumes MUST be always with absolute path
# Note - Mounted host volumes will be created if not existing

# 1. For Linux s Docker runs natively it can mount to any folder (on any drive etc...) - in this case use the current $PWD
docker create -it -v $(pwd)/clamav:/home/docker --name clamav-builder amazonlinux
# docker create -it -v ${pwd}/clamav:/home/docker --name clamav-builder amazonlinux
# docker create -it -v `pwd`/clamav:/home/docker --name clamav-builder amazonlinux
# 2. For Windows DockerToolbox - only the c:/Users folder is shared by default in the VBox docker machine - mounted as c/Users
# Note it should be absolute so - /c/Users/xxxx , not c/Users/xxxx
# docker create -it -v /c/Users/clamav:/home/docker --name clamav-builder amazonlinux

echo "-- Start the AmazonLinux container --"
docker start clamav-builder

echo "-- Update download and unpack ClamAV and ClamAV-Update inside the container --"
docker exec -it -w /home/docker clamav-builder yum install -y cpio yum-utils
docker exec -it -w /home/docker clamav-builder yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
docker exec -it -w /home/docker clamav-builder yum-config-manager --enable epel
docker exec -it -w /home/docker clamav-builder yumdownloader -x \*i686 --archlist=x86_64 clamav clamav-lib clamav-update json-c pcre2
docker exec -it -w /home/docker clamav-builder /bin/sh -c "echo 'folder content' && ls -la"
docker exec -it -w /home/docker clamav-builder /bin/sh -c "rpm2cpio clamav-0*.rpm | cpio -idmv"
docker exec -it -w /home/docker clamav-builder /bin/sh -c "rpm2cpio clamav-lib*.rpm | cpio -idmv"
docker exec -it -w /home/docker clamav-builder /bin/sh -c "rpm2cpio clamav-update*.rpm | cpio -idmv"
docker exec -it -w /home/docker clamav-builder /bin/sh -c "rpm2cpio json-c*.rpm | cpio -idmv"
docker exec -it -w /home/docker clamav-builder /bin/sh -c "rpm2cpio pcre2*.rpm | cpio -idmv"

echo "-- Stop the AmazonLinux container --"
docker stop clamav-builder

echo "-- Remove the AmazonLinux container --"
docker rm clamav-builder

echo "-- Copy the executables and required libraries from ClamAV to our 'severless' folder --"
cp clamav/usr/bin/clamscan clamav/usr/bin/freshclam clamav/usr/lib64/* .
# For Windows copying from the c://Users/clamav
cp c:\\Users/clamav/usr/bin/clamscan c:\\Users/clamav/usr/bin/freshclam c:\\Users/clamav/usr/lib64/* .

echo "-- Clean up ClamAV folder so just the Bin is present --"
rm -rf clamav
# For Windows
rm -rf c:\\Users/clamav





