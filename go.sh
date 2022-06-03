for i in $(ls -d */)
do
    tar -zcvf ${i/'/'/''}.dora $i
done