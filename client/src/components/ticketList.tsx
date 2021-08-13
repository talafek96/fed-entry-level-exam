import React, { Component } from "react";
import TicketClass from "./ticket";
import { Ticket } from "../api";

export interface TicketListProps {
  tickets?: Ticket[];
  currPage: number;
  pageSize: number;
  totalResults: number;
  hiddenCount: number;
  onHide: (ticket: Ticket) => void;
  onRestore: () => void;
}

class TicketList extends React.Component<TicketListProps, {}> {
  renderTickets = (tickets: Ticket[]) => {
    // TODO: Add counter of how many matching results were hidden.
    const { onHide } = this.props;

    return (
      <ul className="tickets">
        {tickets.map((ticket) => (
          <TicketClass ticket={ticket} onHide={onHide} />
        ))}
      </ul>
    );
  };

  renderResultDescription = () => {
    const {
      tickets,
      totalResults,
      currPage,
      pageSize,
    } = this.props;
    if(tickets && tickets.length) { 
        return (
            <span>
                Showing tickets {(currPage - 1) * pageSize + 1}-
                {(currPage - 1) * pageSize + tickets.length} out of a total of{" "}{totalResults}
            </span>
        )
    }
    else {
        return (
            <span>
                No results found
            </span>
        )
    }
  };

  render() {
    const {
      tickets,
      hiddenCount,
      onRestore,
    } = this.props;

    return (
      <span>
        {tickets ? (
          <div className="results">
            {this.renderResultDescription()}
            {hiddenCount ? (
              <div className="hidden-res">
                {" "}
                ({hiddenCount} hidden tickets -{" "}
                <a className="restore-button" onClick={onRestore}>
                  restore
                </a>
                ){" "}
              </div>
            ) : (
              "."
            )}
          </div>
        ) : null}
        {tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
      </span>
    );
  }
}

export default TicketList;
