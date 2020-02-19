import { LightningElement, track, wire } from "lwc";
// Built in CRUD of LWC
import { createRecord, deleteRecord } from "lightning/uiRecordApi";
import { refreshApex } from "@salesforce/apex";

// Custom Apex Methods
import getMyMessages from "@salesforce/apex/MessageController.getMyMessages";
import getAllMessages from "@salesforce/apex/MessageController.getAllMessages";
import sendMessage from "@salesforce/apex/MessageController.sendMessage";

const ACCT_LUKE = "001N000001u6rEBIAY";
const ACCT_SODA = "001N000001u6rJaIAI";

export default class MessageViewer extends LightningElement {
  @track accountId = ACCT_LUKE;
  @track msgValue = "";
  @track msgData = [];
  @track error = null;
  rawMessageRes;

  // WHERE THE MAGIC HAPPENS
  @wire(getAllMessages)
  getMessages(res) {
    // must be assigned the RAW result - otherwise we can force refresh the method
    this.rawMessageRes = res;
    console.log("res => ", res);

    // destructure res
    const { error, data } = res;
    if (data) {
      console.log("data => ", data);
      this.msgData = data;
    } else {
      console.error("error => ", error);
    }
  }

  connectedCallback() {
    this.accountId = ACCT_LUKE;
  }

  handleChangeCurrentUser(e) {
    console.log("e.target.value ", e.target.value);
    this.accountId = e.target.value;
    console.log("this.accountId ", this.accountId);
  }

  handleInputMsg(e) {
    this.msgValue = e.target.value;
  }

  handleSubmitNewMsg(e) {
    // Use apex to create a new Message
    console.log(
      `Creating message related to ${this.accountId} saying "${this.msgValue}"`
    );
    let reqObj = {
      msg: this.msgValue,
      accountId: this.accountId
    };
    console.log("reqObj = (result) => ", reqObj);
    sendMessage(reqObj)
      .then(result => {
        console.log("sendMessage = (result) => ", result);
        // refresh the list ⚡
        refreshApex(this.rawMessageRes);
      })
      .catch(error => {
        console.error("sendMessage = (error) => ", error);

        // remove btn 'loading' ⌛
        // btn_el.classList.remove("loading");
      });

    // Make sure the schema matches RecordInput
    // ref: https://developer.salesforce.com/docs/atlas.en-us.uiapi.meta/uiapi/ui_api_requests_record_input.htm
    // let newMessage = {
    //   apiName: "Message__c",
    //   fields: {
    //     Name: this.msgValue,
    //     Account__c: this.accountId
    //   }
    // };
    // console.log("this.accountId => ", this.accountId);
    // createRecord(newMessage)
    //   .then(res => {
    //     console.log("createRecord ", res);
    //     // refresh the list ⚡
    //     refreshApex(this.rawMessageRes);
    //   })
    //   .catch(error => {
    //     console.error("createRecord = (error) => ", error);

    //     // remove btn 'loading' ⌛
    //     // btn_el.classList.remove("loading");
    //   });
  }

  handleDeleteThisMsgParent(e) {
    console.log(`Delete this msg e: ${e}`);
    console.log(`Delete this msg: ${e.detail}`);
    console.log(`Delete this msg: ${e.detail.id}`);

    let msgId = e.detail.id;
    console.log(`msgId: ${msgId}`);

    deleteRecord(msgId)
      .then(res => {
        console.log("deleteRecord ", res);
        // refresh the list ⚡
        refreshApex(this.rawMessageRes);
      })
      .catch(error => {
        console.error("deleteRecord = (error) => ", error);
      });
  }
}
