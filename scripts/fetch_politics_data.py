from application_only_auth import Client
from secret_settings import *
from time import time, sleep
import json, csv, math
from datetime import datetime, timedelta


client = Client(CONSUMER_KEY, CONSUMER_SECRET)


with open("twitter_political.csv", 'w', encoding='utf-8') as output:
    writer = csv.writer(output, quotechar='"', quoting=csv.QUOTE_NONNUMERIC)
    writer.writerow(["Label", "Keyword","Text"])
    min_id = 0
    n = 10000
    keywords = ['european%20union', 'parliament', 'senate', 'congress', 'united%20nations', 'government', 'conservative', 'liberal']
    kw_index = 0

    rate_limit = client.rate_limit_status()['resources']['search']['/search/tweets']['remaining'] - 1
    t = time()

    while n > 0:
        if rate_limit == 0:
            dt = math.floor(time() - t)
            sleep(max(910 - dt, 0))
            t = time()
            rate_limit = 449

        url = 'https://api.twitter.com/1.1/search/tweets.json?q='+ keywords[kw_index] +'-filter:retweets&lang=en&count=100'
        if min_id:
            url += '&max_id='+str(min_id + 1)
        try:
            tweets = client.request(url)
            min_id = min([x['id'] for x in tweets['statuses']])
            texts = [x['text'] for x in tweets['statuses']]

            rows = [[1, keywords[kw_index],s] for s in texts]
            writer.writerows(rows)

            n -= 100
            if n <= 0 and kw_index < len(keywords) - 1:
                n = 10000
                kw_index += 1
                min_id = None

            rate_limit -= 1
            print(rate_limit)
        except Exception as e:
            print(e)
            print('Rate limit exceeded. Waiting...')
            rate_limit = 0
