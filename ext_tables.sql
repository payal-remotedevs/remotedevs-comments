CREATE TABLE tx_rdcomments_domain_model_comment (
    uid int(11) NOT NULL auto_increment,
    pid int(11) DEFAULT '0' NOT NULL,

    comment int(11) unsigned DEFAULT '0' NOT NULL,
    newsuid int(11) DEFAULT '0' NOT NULL,
    username varchar(255) DEFAULT '' NOT NULL,
    usermail varchar(255) DEFAULT '' NOT NULL,
    paramlink varchar(300) DEFAULT '' NOT NULL,
    description text,
    childcomment int(11) unsigned DEFAULT '0' NOT NULL,
    parent int(11) unsigned DEFAULT '0',
    terms int(11) unsigned DEFAULT '0' NOT NULL,

    PRIMARY KEY (uid),
    KEY parent (pid)
);


CREATE TABLE tx_news_domain_model_news (
	comment  int(11) DEFAULT '0',
);
