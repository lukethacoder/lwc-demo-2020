public with sharing class MessageController {

    /*
	* LWC @wire requires Cacheable=true flag
	**/
	@AuraEnabled(Cacheable=true)
    public static List<Message__c> getMyMessages(String accountId) {
        // return List<Message__c> messages = [ SELECT Id, Name FROM Message__c WHERE Account__c =: accountId];
        List<Message__c> messages = [ SELECT Id, Name FROM Message__c WHERE Account__c =: accountId];
        return messages;
    }
}
