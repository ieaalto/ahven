import csv
import datetime
DATASET = "SA_dataset.csv"
OUTPUT = "out_trimmed.csv"

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


print("Starting...")
t_start = datetime.datetime.now()

with open(DATASET, encoding="utf-8-sig") as file:
    reader = csv.reader(file)
    with open(OUTPUT, 'w', encoding="utf-8-sig") as out:
        writer = csv.writer(out, quotechar='"', quoting=csv.QUOTE_NONNUMERIC)
        i = 0
        for row in reader:
            if i % 10000 == 0:
                print(i)

            new_row = row[:3] + ["".join(row[3:])]
            if i > 0:
                new_row[3] = remove_repetitions(new_row[3].replace('"', '')).lower()
            writer.writerow(new_row)
            i += 1

t_end = datetime.datetime.now()
dt = t_end - t_start
print("Finished in " + str(dt))




