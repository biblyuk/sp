Shortest Path
==

This was a project @mattcg, @matthew-andrews, @WilsonPage, @lucas42 and @georgecrawford -
built for the first Financial Times hackday. We won first prize.

The idea was to provide people with the shortest path ('sp') to factual information about
topics being discussed on Twitter, Facebook, Weibo and elsewhere. It could handle conversations
in English, Chinese, Spanish and French. We passed them through Google Translate, then
through OpenCalais to pick out the subject keywords, then pulled in articles from the FT (pure facts!)
using their search API.