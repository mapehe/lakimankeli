## Pohjadatan lataaminen

```bash
cd data

# Lataa alkuperäiset säädökset ja pura zip
wget https://data.finlex.fi/download/xml/asd/asd-fi.zip
unzip asd-fi.zip

# Poista zip-tiedostot
rm asd-fi.zip

cd ..
```

## Tietokanta

Rinnakkaisessa terminaalissa:

```
docker-compose up
```

## Asennus

```bash
export PGUSER=user
export PGPASSWORD=password
export PGHOST=localhost
export PGDATABASE=db
export PGPORT=5432

# Asenna paketit
yarn

# Preprosessoi data (noin 30min)
yarn start preprocess
```

## Haut

Hae kaikki säädökset, joissa esiintyy sana `auto` ja jokin merkkijonolla `ver`
alkava sana

```bash
yarn start find auto ver%
```
