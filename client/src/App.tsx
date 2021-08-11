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
            <a href="#" className="hide-button" onClick={() => this.onHide(ticket)}>
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

  onRestore = () => {
    let ticketCopy = this.state.tickets
      ? this.state.tickets!.map((ticket) => {
          let newTicket = ticket;
          newTicket.isHidden = false;
          return newTicket;
        })
      : this.state.tickets;
    this.setState({ tickets: ticketCopy, hiddenCount: 0 });
  };

  render() {
    // TODO: Add hidden-res css
    const { tickets, hiddenCount } = this.state;

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
          <div className="results">
            Showing {tickets.length - hiddenCount} results
            {hiddenCount ? (
              <div className="hidden-res">
                {" "}
                ({hiddenCount} hidden tickets -{" "}
                <a href="#" className="restore-button" onClick={this.onRestore}>
                  restore
                </a>
                ){" "}
              </div>
            ) : null}
          </div>
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

  textToHtml = (text: string) => {
    // TODO: Make this formatter work.
    let breakText = text; //.replace(/(\r\n|\r|\n)/g, "\u000a");
    let formatted = breakText.replace(/ /g, "\u00a0");
    console.log(formatted);
    return formatted;
  };

  processText = (text: string) => {
    let trimmed = text.trim();
    if (trimmed.length < 160) {
      return text;
    }
    let to_print: string;
    const { expanded } = this.state;

    if (!expanded) {
      to_print = trimmed.substring(0, MaxUnexpanded).trim() + "...";
    } else {
      to_print = trimmed;
    }

    return to_print;
  };

  render() {
    // TODO: Make text show with correct formatting.
    const { text } = this.props;

    let processed = this.processText(text);

    return (
      <React.Fragment>
        <span className="content" id={this.props.id}>
          {processed}
        </span>
        <a href="#" onClick={this.handleExpand}>{this.formatExpand(text)}</a>
      </React.Fragment>
    );
  }
}
/*.split(/(\r\n|\r|\n)/g)
.map((line) => {
  {
    line;
  }
  <br />;
})}*/

/*
{this.textToHtml(unexpandedText)
.split(/(\r\n|\r|\n)/g)
.map((line) => (
<React.Fragment>{line + "\n"}</React.Fragment>
))}
{unexpandedText.length <= 160 && !expanded ? "..." : ""}
{expanded && // Show if expanded is true.
this.textToHtml(text.substring(MaxUnexpanded))
.split(/(\r\n|\r|\n)/g)
.map((line) => <React.Fragment>{line + "\n"}</React.Fragment>)}
*/
export default App;
