import { LightningElement, wire } from "lwc";
// Custom Apex Methods
import getMyMessages from "@salesforce/apex/MessageController.getMyMessages";

export default class MessageViewer extends LightningElement {
  accountId = "";
  rawMessageRes = null;

  // WHERE THE MAGIC HAPPENS
  // TODO: test this function
  // get education picklist values
  @wire(getMyMessages, {
    ApplicationId: "$applicationId",
    ObjectNameString: "Education__c",
    FieldsToReturn: "$educationFieldsToQuery"
  })
  getMessages(res) {
    // must be assigned the RAW result - otherwise we can force refresh the method
    this.rawMessageRes = res;
    console.log("res => ", res);

    // destructure result
    const { error, data } = result;
    if (data) {
      console.log("data => ", data);
    } else {
      console.error("error => ", error);
    }
  }
}
