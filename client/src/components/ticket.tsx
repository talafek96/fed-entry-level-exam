import React, { Component } from "react";
import { Ticket } from "../api";
import Tag from "./tag"
import Content from "./content"

export interface TicketProps {
  ticket: Ticket;
  onHide: (ticket: Ticket) => void;
}
class TicketClass extends Component<TicketProps, { }> {

  printLabels = (labels?: string[]) => {
    if (!labels) {
      return null;
    }
    let count = 0;
    let delim = 4;
    let res: JSX.Element[] = [];
    for (let i = 0; i < labels.length; i++) {
      if ((i + 1) % delim === 0) {
        res.push(
          <span>
            <Tag label={labels[i]} />
            <br />
          </span>
        );
      } else {
        res.push(
          <span>
            <Tag label={labels[i]} />
          </span>
        );
      }
    }
    return res;
  };

  render() {
    const { ticket } = this.props;
    return (
      <li key={ticket.id} className="ticket">
        <a className="hide-button" onClick={() => this.props.onHide(ticket)}>
          Hide
        </a>
        <h5 className="title">{ticket.title}</h5>
        <Content text={ticket.content} id={ticket.id} />
        <footer>
          <div className="meta-data">
            By {ticket.userEmail} |{" "}
            {new Date(ticket.creationTime).toLocaleString()}
          </div>
          <div className="tags">{this.printLabels(ticket.labels)}</div>
        </footer>
      </li>
    );
  }
}

export default TicketClass;
