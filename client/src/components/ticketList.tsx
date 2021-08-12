import React, { Component } from "react";
import TicketClass from "./ticket";
import { Ticket } from "../api";

export interface TicketListProps {
  tickets?: Ticket[];
  totalResults: number;
  hiddenCount: number;
  onHide: (ticket: Ticket) => void;
  onRestore: () => void;
}

export interface TicketListState {}

class TicketList extends React.Component<TicketListProps, {}> {
  renderTickets = (tickets: Ticket[]) => {
    // TODO: Add counter of how many matching results were hidden.
    // TODO: Make it so the number of found results change according to filter
    const { onHide } = this.props;

    return (
      <ul className="tickets">
        {tickets.map((ticket) => (
          <TicketClass ticket={ticket} onHide={onHide} />
        ))}
      </ul>
    );
  };

  render() {
    const { tickets, hiddenCount, onRestore, totalResults } = this.props;

    return (
      <span>
        {tickets ? (
          <div className="results">
            Showing {tickets.length} results from a total of {totalResults}
            {hiddenCount ? (
              <div className="hidden-res">
                {" "}
                ({hiddenCount} hidden tickets -{" "}
                <a className="restore-button" onClick={onRestore}>
                  restore
                </a>
                ){" "}
              </div>
            ) : null}
          </div>
        ) : null}
        {tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
      </span>
    );
  }
}

export default TicketList;
