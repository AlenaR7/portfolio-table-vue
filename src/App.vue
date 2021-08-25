<template>
    <div class="main">
        <v-app>
            <v-main>
                <TableUI/>
            </v-main>
        </v-app>
    </div>
</template>

<script>
    import TableUI from './components/TableUI';
    import unloadingComponent from './components/UnloadingComponent';

    export default {
        name: 'App',
        components: {
            TableUI,
            unloadingComponent
        }
    }
</script>

<style>
    body {
        background: lightgray;
    }

    .theme--light.v-application {
        background: lightgray !important;
    }

    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }

    .main {
        margin: 0 100px;
    }
</style>
