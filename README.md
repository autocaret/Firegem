# Firegem

Introducing Firegem, a highly versatile PHP-based Content Management System designed specifically for web developers. Built with efficiency and flexibility in mind, Firegem empowers developers to swiftly construct dynamic websites hosted on popular web servers like Apache and Nginx.

With Firegem, you gain access to a comprehensive set of features tailored to meet the unique needs of web development projects. Seamlessly supporting multiple languages, Firegem enables you to effortlessly create websites that cater to diverse audiences around the world.

One of Firegem's standout strengths lies in its ability to handle multi-site server configurations, providing developers with the necessary tools to efficiently manage multiple websites. This flexibility ensures scalability and simplifies the process of maintaining complex web hosting environments.

This project is dedicated to improving the configuration and setup of new websites. It aims to simplify the process, removing unnecessary complexities and reducing the time needed for initial setup. Firegem offers a straightforward and streamlined experience, allowing users to focus on creating their websites instead of getting caught up in technical hurdles.

When it comes to deploying your websites, Firegem excels at minimizing downtime and maximizing productivity. Its streamlined deployment process ensures a swift transition from development to live environments, enabling you to launch your projects quickly and efficiently.

As a web developer, you understand the importance of managing production and live environments effectively. Firegem covers a comprehensive set of tools to facilitate seamless website management, allowing you to update content, optimize performance, and maintain the highest level of quality.

## Development roadmap

We are currently building Firegem 2.5.0.

## How to install

Run the installer, which will install Firegem into /usr/local/Firegem2/.

```bash
sh install.sh
```

After this, go into your designated web directory, e.g. /var/www/site/,
and run the following command:

```bash
sh /usr/local/Firegem2/init.sh
```

This will link the correct files and folders to your site directory.

You will need to modify your virtual host in order for Firegem to see your
.htaccess file:

```xml
<VirtualHost *:80>
    ServerName yoursite.no
    DocumentRoot /var/www/yoursite/html
    <Directory /var/www/yoursite/html>
        Options Indexes FollowSymLinks
        AllowOverride ALL
    </Directory>
</VirtualHost>
```


## History

Firegem is based on the Arena CM project that was started in 2004, at Blest 
Reklamebyrå in Stavanger, Norway. After six years of development, it was first 
open sourced back in 2010. Later, Arena Enterprise was developed as an 
extension to Arena CM in Idéverket AS.

Arena was used to build web sites in Scandinavia for over a decade. It was quite
robust, fast and versatile.

Idéverket AS was rebooted in 2023, and has now rebranded Arena CM into 
Firegem, which has a stronger focus on simplicity and ease of use while making
sure the features and capabilities of the platform are on par with
contemporary solutions.
