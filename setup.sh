sfdx force:org:create -s -f config/project-scratch-def.json -a lukeDev2020 -d 30 -w 10
sfdx force:source:push
sfdx force:user:permset:assign -n All_Access
sfdx force:user:password:generate -u lukeDev2020
sfdx force:org:open