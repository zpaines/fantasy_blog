# import csv

fantasy_stats = ['G', 'GS', 'MP', 'FG', 'FGA', 'FG%', '3P', '3PA', '3P%', '2P', '2PA', '2P%', 'eFG%', 'FT', 'FTA', 'FT%', 'ORB', 'DRB', 'TRB', 'AST', 'STL', 'BLK', 'TOV', 'PF', 'PTS']

# with open('raw_stats.tsv') as stats_file:
#     reader = csv.reader(stats_file, delimiter='\t')
#     stats = {}
#     indices = {}
#     for i, stat in enumerate(next(reader)):
#         stats[stat] = []
#         indices[i] = stat
#     for row in reader:
#         for i, stat_value in enumerate(row):
#             stat_name = indices[i]
#             try:
#                 stats[stat_name].append(float(stat_value))
#             except ValueError:
#                 stats[stat_name].append(stat_value)
            
#     print(sum(stats['AST'])/len(stats['AST']))

import pandas as pd

arr = pd.read_csv('test.tsv', sep='\t')

ast_std_dev = arr['AST'].std()
ast_mean = arr['AST'].mean()

tov_std_dev = arr['TOV'].std()
tov_mean = arr['TOV'].mean()

transform_functions = {}
for col in arr.iteritems():
    stat = col[0]
    if stat in fantasy_stats:
        std_dev = arr[stat].std()
        mean = arr[stat].mean()
        transform_functions[stat] = lambda val: (val-mean)/std_dev
    else:
        transform_functions[stat] = lambda val: val

print(arr.transform(transform_functions))
