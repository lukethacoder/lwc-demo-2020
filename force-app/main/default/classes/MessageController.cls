public with sharing class MessageController {

    public class MessageException extends Exception {
        // No implementation
    }
    /*
	* LWC @wire requires Cacheable=true flag
	**/
	@AuraEnabled(Cacheable=true)
    public static List<Message__c> getAllMessages() {
        List<Message__c> messages = [ SELECT Id, Name, Account__r.Name, Account__c, CreatedDate FROM Message__c ORDER BY CreatedDate ];
        return messages;
    }
    
	@AuraEnabled(Cacheable=true)
    public static List<Message__c> getMyMessages(String accountId) {
        // return List<Message__c> messages = [ SELECT Id, Name FROM Message__c WHERE Account__c =: accountId];
        List<Message__c> messages = [ SELECT Id, Name, Account__r.Name, Account__c, CreatedDate FROM Message__c WHERE Account__c =: accountId ORDER BY CreatedDate  ];
        return messages;
    }
    
    /*
	* LWC imperatively call this, no need for Cacheable=true flag
	**/
	@AuraEnabled
    public static Message__c sendMessage(String msg, String accountId) {
        System.debug('About to create message on with AccountId: ' + accountId + '. Message: ' + msg);

        Message__c new_msg = new Message__c(
            Name = msg,
            Account__c = accountId
        );
        upsert new_msg;
        System.debug('Created message on with AccountId: ' + new_msg.Account__c + '. Message: ' + new_msg.Name);

        return new_msg;
    }
}
