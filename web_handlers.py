from tornado import web
from sklearn.externals import joblib
from secret_settings import CONSUMER_KEY, CONSUMER_SECRET
from application_only_auth import Client, ClientException

import json

print('Loading models...')
sent_clf = joblib.load('sentiment_classifier.pkl')
polit_clf = joblib.load('polit_classifier.pkl')
print('Models loaded!')
client = Client(CONSUMER_KEY, CONSUMER_SECRET)


class IndexHandler(web.RequestHandler):

    def get(self, *args, **kwargs):
        return self.render('index.html')


class ReceiveHandler(web.RequestHandler):

    def post(self, *args, **kwargs):
        try:
            request_type = self.get_argument('type')
            content = self.get_argument('content')
        except web.MissingArgumentError:
            return web.HTTPError(400)

        if request_type == 'text':
            sentiment = int(sent_clf.predict([content])[0])
            political = polit_clf.predict([content])[0] == "POLIT"
            return self.write(json.dumps([{
                'type': 'text',
                'content': content,
                'sentiment': sentiment,
                'political': political
            }]))
        if request_type == 'twitter':
            try:
                api_response = client.request('https://api.twitter.com/1.1/search/tweets.json?q='+ content +'-filter:retweets&lang=en&count=15')

            except ClientException:
                return self.write(json.dumps({
                    'error': 'Twitter API rate limit has been exceeded. Try again later.'
                }))

            tweet_texts = [status['text'] for status in api_response['statuses']]
            tweet_details = [(status['id'], status['user']['screen_name'])for status in api_response['statuses']]
            sentiments = list(sent_clf.predict(tweet_texts))
            political = list(polit_clf.predict(tweet_texts))
            pairs = [{'type': 'tweet',
                      'id': str(tweet_details[i][0]),
                      'screen_name': tweet_details[i][1],
                      'sentiment': int(sentiments[i]),
                      'political': (political[i] == 'POLIT')
                      } for i in range(len(sentiments))]
            return self.write(json.dumps(pairs))


        return web.HTTPError(400)