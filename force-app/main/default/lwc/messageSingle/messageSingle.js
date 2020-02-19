import { LightningElement, track, api } from "lwc";

const ACCT_LUKE = "001N000001u6rEBIAY";
const ACCT_SODA = "001N000001u6rJaIAI";

export default class MessageSingle extends LightningElement {
  @api msgId;
  @api msgText;
  @api msgDateTime;
  @api msgUser;
  @api msgUserId;

  @track localDate = "";

  @track msgWrapperClass = "";
  @track msgClass = "";

  renderedCallback() {
    if (this.msgUserId === ACCT_LUKE) {
      this.msgWrapperClass = `slds-chat-listitem slds-chat-listitem_outbound`;
      this.msgClass = `slds-chat-message__text slds-chat-message__text_outbound`;
    } else {
      this.msgWrapperClass = `slds-chat-listitem slds-chat-listitem_inbound`;
      this.msgClass = `slds-chat-message__text slds-chat-message__text_inbound`;
    }

    let fromApiDate = new Date(this.msgDateTime);
    this.localDate = `${fromApiDate.toLocaleTimeString()} - ${fromApiDate.toLocaleDateString()}`;
  }

  handleDeleteThisMsg(e) {
    console.log(
      "child component handleDeleteThisMsg. about to fire parent ",
      e.target.dataset.id
    );

    // 'ondeletethismsg={PARENT_FUNCTION_NAME}' will be fired when this event is dispatched
    const eventForParent = new CustomEvent("deletethismsg", {
      detail: {
        id: e.target.dataset.id
      }
    });

    // dispatch the event to the parent component
    this.dispatchEvent(eventForParent);
  }
}
