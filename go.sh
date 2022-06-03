array=(`ls -d */ | tr '/' ' '`)
for var in ${array[@]}
do
    tar -zcvf $var.dora $var
done