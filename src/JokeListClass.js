import React from 'react';
import axios from 'axios';
import JokeClass from './JokeClass';

class JokeListClass extends React.Component {
	static defaultProps = { numJokesToGet: 10 };

	constructor(props) {
		super(props);
		this.state = { jokes: [] };
		this.generateNewJokes = this.generateNewJokes.bind(this);
		this.vote = this.vote.bind(this);
	}

	async getJokes() {
		let jokes = [ ...this.state.jokes ];
		let seenJokes = new Set();
		try {
			while (jokes.length < this.props.numJokesToGet) {
				let res = await axios.get('https://icanhazdadjoke.com', {
					headers: { Accept: 'application/json' }
				});
				let { status, ...jokeObj } = res.data;
				if (!seenJokes.has(jokeObj.id)) {
					seenJokes.add(jokeObj.id);
					jokes.push({ ...jokeObj, votes: 0 });
				} else {
					console.error('duplicate found!');
				}
			}
			console.log('what is jokes', jokes);
			this.setState({ jokes });
		} catch (e) {
			console.log(e);
		}
	}

	componentDidMount() {
		if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
	}
	componentDidUpdate(prevProps, prevState) {
		if (prevState.jokes !== this.state.jokes) {
			if (this.state.jokes.length < this.props.numJokesToGet) this.getJokes();
		}
		console.log(prevProps);
		console.log(prevState);
	}
	componentWillUnmount() {}

	/* empty joke list and then call getJokes */

	generateNewJokes() {
		console.log('what is going on');
		this.setState((st) => ({ jokes: st.jokes.filter((j) => j.locked) }));
	}

	/* change vote for this id by delta (+1 or -1) */

	vote(id, delta) {
		// this.setState((allJokes) => {
		// 	allJokes.jokes.map((jokes) => (jokes.id === id ? { ...jokes, votes: jokes.votes + delta } : jokes));
		// });

		let jokes = this.state.jokes.map(
			(jokes) => (jokes.id === id ? { ...jokes, votes: jokes.votes + delta } : jokes)
		);
		console.log('this my my new res', this.state);
		this.setState({ jokes });
	}
	/* render: either loading spinner or list of sorted jokes. */
	// this goes in the if jokes.length

	render() {
		if (1 === 1) {
			let sortedJokes = [ ...this.state.jokes ].sort((a, b) => b.votes - a.votes);
			return (
				<div className="JokeList">
					<button className="JokeList-getmore" onClick={this.generateNewJokes}>
						Get New Jokes
					</button>

					{sortedJokes.map((j) => (
						<JokeClass text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
					))}
				</div>
			);
		} else {
			return null;
		}
	}
}
export default JokeListClass;
