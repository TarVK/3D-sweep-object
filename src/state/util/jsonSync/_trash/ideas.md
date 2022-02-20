# Inserting

When having text:

```json
{
    "spoof": {
        "or": 45
    },
    "shit": {
        "val": 3
    }
}
```

And typing:

```json
{
    "spoof": {
        "or": 45
    },
    "or
    "shit": {
        "val":3
    }
}
```

1. The `"or` should be tested on the "spoof"-syncer:
    1. If "spoof" accepts the `"o`, we're left with sub-problem `r`
    2. If "spoof" fully accepts the `"or` addition, we have to check whether it accepts the next text:
        1. If "spoof" accepts part of the text of the "shit"-syncer, we're left with the sub-problem of the remainder of the "shit"-syncer's text
        2. If "spoof does not accept any of the "shit"-syncer's text, we're done.
2. The `"or` should be tested on the "Shit"-syncer's parser, creating a "draft"
