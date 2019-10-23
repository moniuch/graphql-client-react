import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { addBookMutation, getAuthorsQuery, getBooksQuery } from '../queries/queries';
import { flowRight as compose } from 'lodash';

class AddBook extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			genre: '',
			authorId: '',
		};
	}

	displayAuthors() {
		const { getAuthorsQuery } = this.props;
		if (getAuthorsQuery.loading) {
			return (
				<option value="">Loading authors...</option>
			);
		} else {
			return getAuthorsQuery.authors.map(author => {
				return (
					<option key={author.id} value={author.id}>{author.name}</option>
				);
			});
		}
	}

	submitForm(e) {
		e.preventDefault();
		const { name, genre, authorId } = this.state;
		this.props['addBookMutation']({
			variables: {
				name, genre, authorId,
			},
			refetchQueries: [{ query: getBooksQuery }],
		});
	}

	render() {
		return (
			<form id="add-book" onSubmit={this.submitForm.bind(this)}>
				<div className="field">
					<label>Book name:</label>
					<input type="text" onChange={(e) => this.setState({ name: e.target.value })}/>
				</div>

				<div className="field">
					<label>Genre:</label>
					<input type="text" onChange={(e) => this.setState({ genre: e.target.value })}/>
				</div>

				<div className="field">
					<label>Author:</label>
					<select onChange={(e) => this.setState({ authorId: e.target.value })}>
						<option value="">Select author</option>
						{this.displayAuthors()}
					</select>
				</div>

				<button>+</button>
			</form>
		);
	}
}

export default compose(
	graphql(getAuthorsQuery, { name: 'getAuthorsQuery' }),
	graphql(addBookMutation, { name: 'addBookMutation' }),
)(AddBook);
