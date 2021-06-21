#!/bin/bash

#Shell Script to read csv
echo "Use this script to read group and user from a csv"
echo "Please enter the CSV file name"
read csv_filepath
echo "Reading from file at $csv_filepath"

while IFS="," read -r group user
do
    echo "$group $user"
    $check = ldapsearch -hostname localhost -p 1389 -D "cn=Manager,dc=example,dc=com" -w mysecretpassword -b dc=example,dc=com "(&(objectClass=user)(uid=$user)(memberof=CN=$group,OU=unit,DC=example,DC=com))"
    if [ -z "$check"]
    then
        $data = "dn: cn=$group,ou=unit,dc=example,dc=com
                changetype: modify
                add: memberUid
                memberUid: $user"
        
        echo $data > add_user_to_group.ldif

        ldapmodify -Z -x -W -D "cn=Manager,dc=example,dc=com" -w mysecretpassword -f ./add_to_group.ldif
        
    else
        echo "User is already part of the group"
    
done < <(tail -n +2 $csv_filepath)