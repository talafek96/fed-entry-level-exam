import React from "react";
import "./App.scss";
import { createApiClient, Ticket } from "./api";

export type AppState = {
  tickets?: Ticket[];
  search: string;
  hiddenCount: number;
};

export type ContentState = {
  expanded: boolean;
};

export type ContentProps = {
  text: string;
  id: string;
};

const api = createApiClient();
const MaxUnexpanded = 160;

export class App extends React.PureComponent<{}, AppState> {
  state: AppState = {
    search: "",
    hiddenCount: 0,
  };

  searchDebounce: any = null;

  async componentDidMount() {
    this.setState({
      tickets: await api.getTickets(),
    });
  }

  renderTickets = (tickets: Ticket[]) => {
    // TODO: Add counter of how many matching results were hidden.
    const filteredTickets = tickets.filter(
      (t) =>
        (t.title.toLowerCase() + t.content.toLowerCase()).includes(
          this.state.search.toLowerCase()
        ) && (t.isHidden ? !t.isHidden : true)
    );

    return (
      <ul className="tickets">
        {filteredTickets.map((ticket) => (
          <li key={ticket.id} className="ticket">
            <a
              className="hide-button"
              href="#"
              onClick={() => this.onHide(ticket)}
            >
              Hide
            </a>
            <h5 className="title">{ticket.title}</h5>
            <Content text={ticket.content} id={ticket.id} />
            <footer>
              <div className="meta-data">
                By {ticket.userEmail} |{" "}
                {new Date(ticket.creationTime).toLocaleString()}
              </div>
            </footer>
          </li>
        ))}
      </ul>
    );
  };

  onSearch = async (val: string, newPage?: number) => {
    clearTimeout(this.searchDebounce);

    this.searchDebounce = setTimeout(async () => {
      this.setState({
        search: val,
      });
    }, 300);
  };

  onHide = (ticket: Ticket) => {
    let ticketCopy = this.state.tickets
      ? this.state.tickets!.map((t) =>
          t.id === ticket.id ? { ...ticket, isHidden: true } : t
        )
      : this.state.tickets;
    let numHidden = this.state.hiddenCount + 1;
    this.setState({
      tickets: ticketCopy,
      hiddenCount: numHidden,
    });
  };

  render() {
    const { tickets } = this.state;

    return (
      <main>
        <h1>Tickets List</h1>
        <header>
          <input
            type="search"
            placeholder="Search..."
            onChange={(e) => this.onSearch(e.target.value)}
          />
        </header>
        {tickets ? (
          <div className="results">Showing {tickets.length} results</div>
        ) : null}
        {tickets ? this.renderTickets(tickets) : <h2>Loading..</h2>}
      </main>
    );
  }
}

class Content extends React.PureComponent<ContentProps, ContentState> {
  state: ContentState = { expanded: false };

  handleExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  formatExpand = (text: string) => {
    if (text.length < MaxUnexpanded) {
      return "";
    }
    return this.state.expanded ? "See less" : "See more";
  };

  render() { // TODO: Make text show with correct formatting.
    const { expanded } = this.state;
    const { text } = this.props;

    let unexpandedText = text
      .substring(0, Math.min(MaxUnexpanded, text.length - 1))
      .trimEnd();
    console.log(text);
    return (
      <React.Fragment>
        <span className="content" id={this.props.id}>
          {unexpandedText.length <= 160 && !expanded
            ? unexpandedText + "..."
            : text}
          {expanded && // Show if expanded is true. */
            unexpandedText.substring(MaxUnexpanded)}
        </span>
        <a onClick={this.handleExpand}>{this.formatExpand(text)}</a>
      </React.Fragment>
    );
  }
}

export default App;
