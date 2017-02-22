import React from 'react';
import ReactDOM from 'react-dom';
import TweetEmbed from 'react-tweet-embed'

var $ = require('jquery');


class ContentContainer extends React.Component{
    render(){
        var listElements = this.props.elements.map(element => {
            var content = element.type == 'tweet' ? <TweetEmbed id={element.id}/> : element.content;
            var className = element.sentiment === 1 ? 'positive' : 'negative';

            return(
                <li className={className}>
                    {element.political && <span className="topic-label">Politics</span>}
                    <div>{content}</div>
                </li>
            )
        });

        return(
            <ul className="content-container">
                {listElements}
            </ul>
        )
    }


}

class Form extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            "value" : ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event){
        this.setState({'value': event.target.value})
    }

    handleSubmit(event){
        event.preventDefault();
        this.props.onSubmit({
            type: this.type,
            content: this.state.value
        })
    }
}


class TextForm extends Form{
    constructor(props){
        super(props);
        this.type = 'text'
    }

    render(){
        return(
            <div className="action">
                <h4>Type something to classify:</h4>
                <form onSubmit={this.handleSubmit} className="form">
                    <textarea value={this.state.value} onChange={this.handleChange} rows="2" className="form-control"/>
                    <input type="submit" value="Classify" className="btn btn-primary"/>
                </form>
            </div>
        )
    }
}

class TwitterQueryForm extends Form{
    constructor(props){
        super(props);
        this.type = 'twitter'
    }

    render(){
        return(
            <div className="action">
                <h4>...or search tweets to be classified:</h4>
                <form onSubmit={this.handleSubmit} className="form">
                    <input type="text" value={this.state.value} onChange={this.handleChange} className="form-control"/>
                    <input type="submit" value="Search" className="btn btn-primary"/>
                </form>
            </div>
        )
    }
}


class Actions extends React.Component{
    render(){
        return(
            <div className="actions">
                <TextForm onSubmit={this.props.onSubmit}/>
                <TwitterQueryForm onSubmit={this.props.onSubmit}/>
            </div>
        )
    }
}



class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            classified_content : []
        };

        this.getClassifications = this.getClassifications.bind(this)
    }

    getClassifications(data){
        $.ajax({
            url: '/classify/',
            type: 'POST',
            data: data,
            dataType: 'json',
            complete: (response, status) => {
                if(status == 'success'){
                    this.setState({classified_content: []});
                    console.log(response.responseText);
                    this.setState({classified_content: JSON.parse(response.responseText)})
                }
            }
        })
    }

    render(){
        return(
            <div className="container">
                <div className="row">
                    <div className="col-lg-4">
                        <Actions onSubmit={this.getClassifications}/>
                    </div>
                    <div className="col-lg-8">
                        <ContentContainer elements={this.state.classified_content}/>
                    </div>
                </div>
            </div>)
    }
}


ReactDOM.render(
    <App />,
    document.getElementById('root')
);
