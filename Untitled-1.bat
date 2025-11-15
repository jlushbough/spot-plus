cd /usr/local/src
wget https://github.com/prometheus/node_exporter/releases/download/v1.8.1/node_exporter-1.8.1.linux-amd64.tar.gz
tar -xzvf node_exporter-1.8.1.linux-amd64.tar.gz
cd node_exporter-1.8.1.linux-amd64/
cp node_exporter /usr/local/bin
useradd -rs /bin/false node_exporter
curl http://rushmoreu24/node_exporter.service -o /etc/systemd/system/node_exporter.service
sudo systemctl daemon-reload
sudo systemctl start node_exporter
sudo systemctl enable node_exporter
sudo systemctl status node_exporter
ssh-keygen -t ed25519 -N '' -f /root/.ssh/id_ed25519
rm -f /etc/ssh/ssh_host_*
dpkg-reconfigure openssh-server
systemctl restart ssh
exit
do-release-upgrade
apt update
clear
apt install nfs-common
sudo apt-get install python3-pip
sudo apt install realmd sssd sssd-tools adcli samba-common-bin krb5-user
realm discover MEDCAMPUS.ORG
realm join -U lushboujda MEDCAMPUS.ORG
wget http://rushmoreu24:8080/ubuntu2404/etc/pam.d/common-session -O 1
vi 1
wget http://rushmoreu24:8080/ubuntu2404/etc/pam.d/common-session -O /etc/pam.d/common-session
wget http://rushmoreu24:8080/ubuntu2404/etc/sssd/sssd.conf -O 1
vi 1
kinit
kinit lushbouj@MEDCAMPUS.ORG
klist
wget http://rushmoreu24:8080/ubuntu2404/etc/sssd/sssd.conf -O /etc/sssd/sssd.conf
vi /etc/sssd/sssd.conf
sudo pam-auth-update --enable mkhomedir
wget http://rushmoreu24:8080/ubuntu2404/etc/krb5.conf -O /etc/krb5.conf
chmod 600 /etc/sssd/sssd.conf
chown root:root /etc/sssd/sssd.conf
chmod 644 /etc/pam.d/common-session
chown root:root /etc/pam.d/common-session
chmod 644 /etc/krb5.conf
chown root:root /etc/krb5.conf
systemctl enable sssd
realm leave MEDCAMPUS.ORG
realm join --user=lushboujda MEDCAMPUS.ORG
exit
vi /etc/sssd/sssd.conf
systemctl restart sssd
exit
vi /etc/sssd/sssd.conf
getent passwd lushbouj
sudo sss_cache -u lushbouj
getent passwd lushbouj
sudo systemctl restart sssd
getent passwd lushbouj
cd /home
ls -al
mv lushbouj@medcampus.org/ lushbouj
sudo chown -R lushbouj:lushbouj /home/lushbouj
exit
cat /etc/krb5.conf
cat /etc/krb5.keytab
vi /etc/sssd/sssd.conf
sudo systemctl restart sssd
sudo sss_cache -E
exit
sudo journalctl -u sssd -f
host -t srv _ldap._tcp.medcampus.org
vi /etc/sssd/sssd.conf
systemctl restart sssd
sudo sss_cache -E
sudo journalctl -u sssd -f
cat /etc/sssd/sssd.conf
sudo klist -k
kinit -k EA721352U24$@MEDCAMPUS.ORG
sudo kinit -k EA721352U24$@MEDCAMPUS.ORG
sudo realm leave medcampus.org
sudo systemctl stop sssd
sudo rm -f /var/lib/sss/db/*
sudo rm -f /etc/krb5.keytab
sudo systemctl start sssd
systemctl status sssd.service
history | grep realm
realm join --user=lushboujda MEDCAMPUS.ORG
realm disvocer
realm discover
realm discover  MEDCAMPUS.ORG
realm join --user=lushboujda MEDCAMPUS.ORG
history
systemctl status sssd.service
kinit -k EA721352U24$@MEDCAMPUS.ORG
ls -l /etc/krb5.keytab
sudo klist -k /etc/krb5.keytab
cat /etc/krb5.conf
sudo kinit -k EA721352U24$@MEDCAMPUS.ORG
sudo strace -o /tmp/kinit_trace.txt kinit -k EA721352U24$@MEDCAMPUS.ORG
grep 'openat' /tmp/kinit_trace.txt | grep 'krb5'
grep 'openat' /tmp/kinit_trace.txt | grep -E 'hosts|nsswitch|hostname'
# File 1: The Hostname File
cat /etc/hostname
# File 2: The Hosts File (very likely culprit)
cat /etc/hosts
# File 3: The Name Service Switch (also a likely culprit)
cat /etc/nsswitch.conf
sudo kinit -k -p EA721352U24$@MEDCAMPUS.ORG
sudo realm leave medcampus.org
sudo realm join --user lushboujda MEDCAMPUS.ORG
sudo kinit -k -p EA721352U24$@MEDCAMPUS.ORG
klist
sudo realm leave medcampus.org
sudo apt-get purge -y sssd realmd adcli
sudo rm -rf /etc/sssd/ /var/lib/sss/ /var/cache/sss/
sudo rm -f /etc/krb5.conf /etc/krb5.keytab
sudo apt-get autoremove -y
sudo apt-get clean
sudo apt-get update
sudo apt-get install -y msktutil krb5-user sssd adcli
sudo msktutil -c -b "OU=East,OU=Servers,OU=Data Centers,OU=Essentia,DC=medcampus,DC=org" -s host/ea721352u24.medcampus.org -k /etc/krb5.keytab --computer-name EA721352U24 --upn EA721352U24$ --server dc99.medcampus.org --user-creds-only --verbose -u lushboujda
sudo msktutil -c -b "OU=East,OU=Servers,OU=Data Centers,OU=Essentia,DC=medcampus,DC=org" -s host/ea721352u24.medcampus.org -k /etc/krb5.keytab --computer-name EA721352U24 --upn EA721352U24$ --server dc99.medcampus.org --user-creds-only --verbose lushboujda
sudo msktutil -c -b "OU=East,OU=Servers,OU=Data Centers,OU=Essentia,DC=medcampus,DC=org" -s host/ea721352u24.medcampus.org -k /etc/krb5.keytab --computer-name EA721352U24 --upn EA721352U24$ --server dc99.medcampus.org --user-creds-only --verbose
cat <<EOF | sudo tee /etc/krb5.conf
[libdefaults]
        default_realm = MEDCAMPUS.ORG
        dns_lookup_kdc = true
        dns_lookup_realm = true
EOF
kinit lushbouj
klist
udo msktutil -u -b "OU=East,OU=Servers,OU=Data Centers,OU=Essentia,DC=medcampus,DC=org" -s host/ea721352u24.medcampus.org -k /etc/krb5.keytab --computer-name EA721352U24 --upn EA721352U24$ --server dc99.medcampus.org --verbose
sudo msktutil -u -b "OU=East,OU=Servers,OU=Data Centers,OU=Essentia,DC=medcampus,DC=org" -s host/ea721352u24.medcampus.org -k /etc/krb5.keytab --computer-name EA721352U24 --upn EA721352U24$ --server dc99.medcampus.org --verbose
kinit lushboujda
id lushbouj
id lushbouj@medcampus.org
id lushbouj@MEDCAMPUS.ORG
realm list
readlm
realm
history
kinit lushboujda
klist
which sssd
history | grep sssd
history
history > 1.txt
vi 1.txt
cat 1.txt
sudo apt-get update
sudo apt-get install -y sssd realmd adcli
realm discover MEDCAMPUS.ORG
sudo realm join -U lushboujda MEDCAMPUS.ORG
sudo realm leave -U lushboujda MEDCAMPUS.ORG
sudo realm join -U lushboujda MEDCAMPUS.ORG
sudo systemctl status sssd
sudo realm leave MEDCAMPUS.ORG
sudo systemctl stop sssd
sudo rm -f /var/lib/sss/db/*
sudo rm -f /etc/krb5.keytab
sudo rm -f /etc/sssd/sssd.conf
sudo realm join --verbose MEDCAMPUS.ORG -U lushboujda
sudo mkdir /etc/sssd
sudo chmod 0755 /etc/sssd
sudo realm join --verbose MEDCAMPUS.ORG -U lushboujda
sudo systemctl status sssd
# Check that the sssd.conf file was created
sudo cat /etc/sssd/sssd.conf
# Check that a user can be resolved from the domain
id lushbouj@medcampus.org
# List the keys in the keytab
sudo klist -k /etc/krb5.keytab
sudo systemctl stop sssd
sudo rm -rf /var/lib/sss/db/*
sudo rm -rf /var/lib/sss/mc/*
sudo rm -f /var/log/sssd/*
sudo chown root:root /etc/sssd/sssd.conf
sudo chmod 600 /etc/sssd/sssd.conf
sudo systemctl start sssd
sudo systemctl status sssd
ls -al /etc/sssd/
sudo systemctl stop sssd
# Run sssd in interactive debug mode.
# This will produce a lot of output. Look for the last error messages before it exits.
sudo /usr/sbin/sssd -i -d 9 --logger=stderr
sudo journalctl -xeu sssd.service
sudo mkdir -p /var/lib/sss/db /var/lib/sss/mc
# Change the owner of these directories to the sssd user and group
sudo chown sssd:sssd /var/lib/sss/db /var/lib/sss/mc
# Set strict permissions so only the sssd user can access them
sudo chmod 0700 /var/lib/sss/db /var/lib/sss/mc
sudo systemctl start sssd
# Immediately check its status
sudo systemctl status sssd
history | grep wget
wget http://rushmoreu24:8080/ubuntu2404/etc/pam.d/common-session -O /etc/pam.d/common-session
wget http://rushmoreu24:8080/ubuntu2404/etc/sssd/sssd.conf -O /etc/sssd/sssd.conf
wget http://rushmoreu24:8080/ubuntu2404/etc/krb5.conf -O /etc/krb5.conf
sudo systemctlr restart sssd
sudo systemctl restart sssd
journalctl -xeu sssd.service
# Display the permissions for the parent sss directory
ls -ld /var/lib/sss
# Set the correct owner and permissions on the parent directory
sudo chown sssd:sssd /var/lib/sss
sudo chmod 0700 /var/lib/sss
# Attempt to start the service
sudo systemctl start sssd
# Immediately check its status
sudo systemctl status sssd
# Step 1: Stop any running services and force a realm leave (it will likely fail, that's fine)
sudo systemctl stop sssd
sudo realm leave MEDCAMPUS.ORG
# Step 2: Purge all related packages. 'purge' removes config files, which is critical.
sudo apt-get purge -y sssd realmd adcli sssd-tools samba-common-bin libnss-sss libpam-sss
# Step 3: Clean up any remaining files from the old packages.
sudo apt-get autoremove -y
sudo apt-get clean
# Step 4: Manually and forcefully delete EVERY directory related to the old setup.
# This ensures no bad state remains.
sudo rm -rf /etc/sssd/
sudo rm -rf /var/lib/sss/
sudo rm -rf /var/cache/sss/
sudo rm -rf /var/log/sssd/
sudo rm -f /etc/krb5.keytab
sudo rm -f /etc/krb5.conf
# Step 1: Update your package list
sudo apt-get update
# Step 2: Install the required packages fresh.
# This will recreate necessary users and base directories with correct default permissions.
sudo apt-get install -y sssd-tools sssd realmd adcli
# Step 3: Discover the realm to ensure network connectivity and DNS are still good.
realm discover MEDCAMPUS.ORG
# Step 4: Perform the join. Use the verbose flag to see what's happening.
# Let the tool do all the work of creating the config files. Do not create them manually.
sudo realm join --verbose MEDCAMPUS.ORG -U lushboujda
# Step 5: Final verification
sudo systemctl status sssd
cat /etc/krb5.conf
# Install the utility
sudo apt-get update
sudo apt-get install -y msktutil
# Create a minimal krb5.conf. This tells all Kerberos tools what your default domain is.
cat <<EOF | sudo tee /etc/krb5.conf
[libdefaults]
        default_realm = MEDCAMPUS.ORG
        dns_lookup_kdc = true
        dns_lookup_realm = true
EOF
sudo msktutil -c -b "CN=Computers,DC=medcampus,DC=org" --computer-name EA721352U24 --upn EA721352U24$ --server dc99.medcampus.org -k /etc/krb5.keytab --verbose -u lushboujda
# This is the corrected version of the command from Step 3
sudo msktutil -c -b "CN=Computers,DC=medcampus,DC=org" --computer-name EA721352U24 --upn EA721352U24$ --server dc99.medcampus.org -k /etc/krb5.keytab --verbose lushboujda
sudo kinit lushboujda@MEDCAMPUS.ORG
klist
sudo msktutil -c -b "CN=Computers,DC=medcampus,DC=org" --computer-name EA721352U24 --upn EA721352U24$ --server dc99.medcampus.org -k /etc/krb5.keytab --verbose
dig dc99.medcampus.org
dig -x 10.172.159.121
dig -x @10.172.159.121 10.172.159.121
dig -t SRV _ldap._tcp.medcampus.org
sudo msktutil -c -b "CN=Computers,DC=medcampus,DC=org" --computer-name EA721352U24 --upn EA721352U24$ --server dlhmcdc01.medcampus.org -k /etc/krb5.keytab --verbose
sudo msktutil -c -b "CN=Computers,DC=medcampus,DC=org" --computer-name EA721352U24 --upn EA721352U24$ --server dlhmcdc01.medcampus.org -k /etc/krb5.keytab --verbose --no-reverse-lookups
sudo msktutil -c -b "OU=East,OU=Servers,OU=Data Centers,OU=Essentia,DC=medcampus,DC=org" --computer-name EA721352U24 --upn EA721352U24$ --server dlhmcdc01.medcampus.org -k /etc/krb5.keytab --verbose
sudo msktutil -c -b "OU=East,OU=Servers,OU=Data Centers,OU=Essentia,DC=medcampus,DC=org" --computer-name EA721352U24 --upn EA721352U24$ --server dlhmcdc01.medcampus.org -k /etc/krb5.keytab --verbose --no-reverse-lookups
sudo msktutil -c -b "OU=East,OU=Servers,OU=Data Centers,OU=Essentia,DC=medcampus,DC=org" --computer-name EA721352U24 --upn EA721352U24$ --server dlhmcdc01.medcampus.org --dont-search-base -k /etc/krb5.keytab --verbose --no-reverse-lookups
sudo adcli join medcampus.org --domain-ou "OU=East,OU=Servers,OU=Data Centers,OU=Essentia,DC=medcampus,DC=org" --login-user lushboujda --verbose
cat /etc/sssd/sssd.conf
vi /etc/sssd/sssd.conf
sudo chown root:root /etc/sssd/sssd.conf
sudo chmod 600 /etc/sssd/sssd.conf
# Start and check the service
sudo systemctl restart sssd
sudo systemctl status sssd
id lushbouj
vi /etc/sssd/sssd.conf
systemctl restart sssd
id lushbouj
id lushboujda
id lushbouj-ax
id lushbouj
id nagios_ldap
id nagiosldap
sudo sss_cache -E
# Restart the sssd service
sudo systemctl restart sssd
id nagiosldap
id lushbouj
if lushbouj-ax
id lushbouj-ax
id lushboujda
id nagiosldap
id jmolson1
id
id seversok
vi /etc/sssd/sssd.conf
# Clear the entire cache to force re-evaluation of all users
sudo sss_cache -E
# Restart the sssd service
sudo systemctl restart sssd
id lushbouj
id seversod
id seversok
id lushbouj-ax
vi /etc/sssd/sssd.conf
sudo sss_cache -E
systemctl restart sssd
id lushbouj-ax
id lushbouj
id seversod
id seversok
id lushbouj-ax
id lushboujda
vi /etc/sssd/sssd.conf
sudo sss_cache -E
systemctl restart sssd
id lushboujda
id seversod
id seversok
vi /etc/sssd/sssd.conf
sudo sss_cache -E
systemctl restart sssd
id seversok
vi /etc/sssd/sssd.conf
sudo sss_cache -E
systemctl restart sssd
id seversok
vi /etc/sssd/sssd.conf
sudo sss_cache -E
systemctl restart sssd
id seversok
cat /etc/sssd/sssd.conf
vi /etc/sssd/sssd.conf
sudo sss_cache -E
systemctl restart sssd
id lushbouj
id seversod
id lushbouj
id seversok
id seversod
id jmolson1
id jmolson1da
vi /etc/sssd/sssd.conf
id lushbouj
id ea721352
id lushbouj | grep -i Labs
id ea721352 | grep -i admins
id lushbouj | tr ',' '\n' | cut -d'(' -f2 | cut -d')' -f1
id lushbouj | sed -e 's/groups=/\n\nGroups:\n/' -e 's/,/\n/g' | sed 's/gid=/\n\nPrimary Group:\n/' | sed 's/uid=/\nUser:\n/'
id ea721352 | sed -e 's/groups=/\n\nGroups:\n/' -e 's/,/\n/g' | sed 's/gid=/\n\nPrimary Group:\n/' | sed 's/uid=/\nUser:\n/'
id ehlabs
id group
id --?
id --help
group
groups lushbouj
groups lushboujda
id ea721352 | sed -e 's/groups=/\n\nGroups:\n/' -e 's/,/\n/g' | sed 's/gid=/\n\nPrimary Group:\n/' | sed 's/uid=/\nUser:\n/'
id ea721352 | sed -e 's/groups=/\n\nGroups:\n/' -e 's/,/\n/g' | sed 's/gid=/\n\nPrimary Group:\n/' | sed 's/uid=/\nUser:\n/' | grep -i lab
vi /etc/sssd/sssd.conf
sss_cache -E
systemctl restart sssd
id lushbouj
id lushboujda
id seversod
visudo
exot
exit
id lushbouj
id ea721352
id cheskya
id achesky
getent group systemadmins
getent group systemadmin
getent group systemadmins
getent group domainusers
getent group domain\ users
getent group "Domain Admins"
sssctl group-show "Domain Admins"
visudo
sss_cache -E
systemctl restart sssd
exit
vi /etc/sssd/sssd.conf
sss_cache -E
systemctl restart sssd
exit
getent group systemadmins
exit
getent group systemadmins
vi /etc/sssd/sssd.conf
sss_cache -E
systemctl restart sssd
exit
eit
exit
ls -al
exit
getent group "a eh labs - is"
vi /etc/sssd/sssd.conf
sss_cache -E
systemctl restart sssd
tail -f /var/log/sssd/sssd_medcampus.org.log
vi /etc/sssd/sssd.conf
sss_cache -E
systemctl restart sssd
tail -f /var/log/sssd/sssd_medcampus.org.log
sudo systemctl status sssd
sudo systemctl stop sssd
sudo rm -f /var/log/sssd/sssd_medcampus.org.log
vi /etc/sssd/sssd.conf
sss_cache -E
systemctl restart sssd
tail -f /var/log/sssd/sssd_medcampus.org.log
vi /etc/sssd/sssd.conf
sss_cache -E
systemctl restart sssd
tail -f /var/log/sssd/sssd_medcampus.org.log
vi /etc/sssd/sssd.conf
sss_cache -E
systemctl restart sssd
vi /etc/sssd/sssd.conf
sss_cache -E
systemctl restart sssd
journalctl -xeu sssd.service
vi /etc/sssd/sssd.conf
systemctl restart sssd
sudo sshd -t
sudo sshd -T | grep -i "allowusers"
vi /etc/sssd/sssd.conf
sss_cache -E
systemctl restart sssd
cat /etc/sssd/sssd.conf
vi /etc/sssd/sssd.conf
sss_cache -E
systemctl restart sssd
journalctl -xeu sssd.service
sshd -T
vi /etc/sssd/sssd.conf
sss_cache -E
systemctl restart sssd
sshd -T
vi /etc/sssd/sssd.conf
sss_cache -E
systemctl restart sssd
sss_cache -E
sshd -T
cat /etc/sssd/sssd.conf
vi /etc/sssd/sssd.conf
sss_cache -E
systemctl restart sssd
sshd -T
vi /etc/sssd/sssd.conf
cp /etc/sssd/sssd.conf /root/sssd.conf
vi /etc/sssd/sssd.conf
sss_cache -E
systemctl restart sssd
vi /root/sssd.conf
vi /etc/ssh/sshd_config
sudo systemctl restart sshd
sudo systemctl restart ssh
id lushbouj
sshd -T | grep -i "allowusers"
cat /etc/krb5.conf
tail -f /var/log/sssd/sssd_medcampus.org.log
exit
cat /etc/ssh/sshd_config