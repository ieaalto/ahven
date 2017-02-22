from application_only_auth import Client
from secret_settings import *
from time import time, sleep
import json, csv, math


def remove_repetitions(s):
    if len(s) < 4:
        return s

    i = 3
    while i < len(s):
        if s[i] == s[i-1] == s[i-2] == s[i-3]:
            s = s[:i] + s[i+1:]
        else:
            i += 1
    return s


def process(s):
    return remove_repetitions(s.replace('"', '')).lower()


client = Client(CONSUMER_KEY, CONSUMER_SECRET)


with open("twitter_pos_200000.csv", 'w', encoding='utf-8') as output:
    writer = csv.writer(output, quotechar='"', quoting=csv.QUOTE_NONNUMERIC)
    writer.writerow(["Sentiment", "SentimentText"])
    min_id = 0
    n = 200000
    rate_limit = client.rate_limit_status()['resources']['search']['/search/tweets']['remaining'] - 1
    t = time()

    while n > 0:
        if rate_limit == 0:
            dt = math.floor(time() - t)
            sleep(max(910 - dt, 0))
            t = time()
            rate_limit = 449

        url = 'https://api.twitter.com/1.1/search/tweets.json?q=%3A)&lang=en&count=100'
        if min_id:
            url += '&max_id='+str(min_id + 1)
        try:
            tweets = client.request(url)
            min_id = min([x['id'] for x in tweets['statuses']])
            texts = [x['text'] for x in tweets['statuses']]

            rows = [[1, process(s)] for s in texts]
            writer.writerows(rows)
            n -= 100
            rate_limit -= 1
            print(rate_limit)
        except:
            print('Rate limit exceeded. Waiting...')
            rate_limit = 0
