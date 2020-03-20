# ae Admin Portal - React

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See production for notes on how to deploy the project on a live system.


### Launch Development API Python

```
cd ae-admin \
workon aenet \
python3 wsgi.py
```

### Launch Development Node Server

```
cd ae-admin/static \
npm run dev
```

### Install Development Environment on New Machine

```
iOS X.X.X
```

### Confirm Node Env
 Install
```
brew install node
```

Version
```
X.X.X
```

### Confirm Virtual Env
Install
```
pip3 install virtualenv virtualenvwrapper
rm -rf ~/.cache/pip
```
Version
```
sudo easy_install pip
pip --version
```
For Error
```
bash: /usr/local/bin/virtualenvwrapper.sh: No such file or directory
```
Fix With
```
find / -name virtualenvwrapper.sh
```
Add to Profile or Bash
```
sudo nano ~/.bash_profile
export APP_ENV="[server.config.]" # DevelopmentConfig or StageConfig
export VIRTUALENVWRAPPER_PYTHON=/usr/bin/python3.5
export WORKON_HOME=$HOME/.virtualenvs
source ~/.local/bin/virtualenvwrapper.sh
```
### Clone
```
git clone https://bitbucket.org/ae/ae-admin/src/master/
&& mkvirtualenv aenet \
&& cd ae-admin \
&& pip3 uninstall -r requirements.txt -y \
&& pip3 install -U -r requirements.txt \
```
### Confirm Nginx
Install Nginx
```
brew install nginx
```
Create SSL
```
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /private/localhost.key -out /private/localhost.crt
sudo openssl dhparam -out /private/dhparam.pem 2048
```
Output
```
Output
Country Name (2 letter code) [AU]:US
State or Province Name (full name) [Some-State]:New York
Locality Name (eg, city) []:New York City
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Bouncy Castles, Inc.
Organizational Unit Name (eg, section) []:Ministry of Water Slides
Common Name (e.g. server FQDN or YOUR name) []:server_IP_address
Email Address []:admin@your_domain.com
```
Config Nginx
```
sudo nano /usr/local/etc/nginx/nginx.conf
```

```
server {
        listen 80;
        server_name localhost;
        root /srv/www/ae-admin/public;
        index index.html index.htm;
        location / {
                try_files $uri $uri/ =404;
        }
        error_page 401 403 404 /404.html;
}

#
# Main
#
server {
    server_name app.localhost;

    ### SSL
    listen 443 ssl;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers 'EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH';
    ssl_prefer_server_ciphers on;
    ssl_dhparam /private/dhparam.pem;
    ssl_certificate /private/localhost.us.crt;
    ssl_certificate_key /private/localhost.us.key;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";

    root /srv/www/ae-admin/static;
    index index.html index.htm;
    location / {
            proxy_pass http://127.0.0.1:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
    }
    error_page 401 403 404 /404.html;
}
```
Link (3 Functions to insure a srv/www structure)
```
mkdir /srv
mkdir /srv/www
ln -s [~/path/to/cloned/ae-admin]  /srv/www/
```

Test
```
sudo nginx -t
```
Restart (After Computer Restart)
```
sudo nginx
```